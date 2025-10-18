import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './entities/project.entity';
import { CollaborationRequest } from './entities/collab-request.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(CollaborationRequest.name)
    private requestModel: Model<CollaborationRequest>,
    private readonly mailService: MailService,
  ) {}

  // CREATE PROJECT
  async createProject(dto: CreateProjectDto, ownerId: string) {
    const project = await this.projectModel.create({
      ...dto,
      owner: new Types.ObjectId(ownerId),
      collaborationActive: false,
    });

    return { message: 'Project created successfully', project };
  }

  // GET ALL PROJECTS (with visibility control)
  async getAllProjects(currentUserId?: string) {
    const projects = await this.projectModel
      .find()
      .populate<{ owner: { _id: Types.ObjectId; name: string; email: string } }>('owner', 'name email')
      .populate<{ teamMembers: { _id: Types.ObjectId; name: string; email: string }[] }>('teamMembers', 'name email');

    const filtered = projects.map((proj) => {
      const isOwner = currentUserId && (proj as any).owner._id.toString() === currentUserId;
      const isMember =
        currentUserId &&
        (proj as any).teamMembers.some((m: any) => m._id.toString() === currentUserId);

      if ((proj as any).collaborationActive || isOwner || isMember) {
        return proj;
      }

      const projectObj = (proj as any).toObject();
      delete (projectObj as any).githubRepo;
      delete (projectObj as any).teamMembers;
      return projectObj;
    });

    return filtered;
  }

  // GET PROJECT BY ID (with visibility control)
  async getProjectById(id: string, currentUserId?: string) {
    const project = await this.projectModel
      .findById(id)
      .populate<{ owner: { _id: Types.ObjectId; name: string; email: string } }>('owner', 'name email')
      .populate<{ teamMembers: { _id: Types.ObjectId; name: string; email: string }[] }>('teamMembers', 'name email');

    if (!project) throw new NotFoundException('Project not found');

    const isOwner = currentUserId && (project as any).owner._id.toString() === currentUserId;
    const isMember =
      currentUserId &&
      (project as any).teamMembers.some((m: any) => m._id.toString() === currentUserId);

    if (!(project as any).collaborationActive && !isOwner && !isMember) {
      const limited = (project as any).toObject();
      delete (limited as any).githubRepo;
      delete (limited as any).teamMembers;
      return limited;
    }

    return project;
  }

  // GET USER'S PERSONAL PROJECTS
  async getMyProjects(userId: string) {
    const ownerObjectId = new Types.ObjectId(userId);

    const projects = await this.projectModel
      .find({ owner: ownerObjectId })
      .populate('teamMembers', 'name email')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    if (!projects || projects.length === 0) {
      return { message: 'You have no projects yet', projects: [] };
    }

    return { message: 'Your projects fetched successfully', total: projects.length, projects };
  }

  // UPDATE PROJECT
  async updateProject(id: string, dto: UpdateProjectDto, userId: string) {
    const project = await this.projectModel.findById(id);
    if (!project) throw new NotFoundException('Project not found');

    if (project.owner.toString() !== userId.toString()) {
      throw new BadRequestException('You are not authorized to update this project');
    }

    const updated = await this.projectModel.findByIdAndUpdate(id, dto, { new: true });
    return { message: 'Project updated successfully', project: updated };
  }

  // DELETE PROJECT
  async deleteProject(id: string, userId: string) {
    const project = await this.projectModel.findById(id);
    if (!project) throw new NotFoundException('Project not found');

    if (project.owner.toString() !== userId.toString()) {
      throw new BadRequestException('You are not authorized to delete this project');
    }

    await this.projectModel.findByIdAndDelete(id);
    return { message: 'Project deleted successfully' };
  }

  // REQUEST COLLABORATION
  async requestCollaboration(projectId: string, requesterId: string) {
    const project = await this.projectModel
      .findById(projectId)
      .populate('owner', 'name email'); // ensures owner.name and owner.email are available
    if (!project) throw new NotFoundException('Project not found');

    // prevent duplicate requests
    const existing = await this.requestModel.findOne({
      project: projectId,
      requester: requesterId,
    });

    if (existing) {
      return { message: 'You have already sent a collaboration request for this project' };
    }

    // create request
    const request = await this.requestModel.create({
      requester: new Types.ObjectId(requesterId),
      project: new Types.ObjectId(projectId),
      projectOwner: (project.owner as any)?._id || project.owner, // store owner id
      status: 'pending',
    });

    // Prepare email
    try {
      const owner = (project.owner as any) || {};
      const email = owner.email;

      if (email) {
        await this.mailService.sendContactEmail(
          'Stack Coders Notification',
          email,             
          `You have a new collaboration request. 
          Please log in to your Stack Coders account to review and take action.`
        );
      } else {
        console.warn('Project owner has no email, skipping notification send.');
      }
    } catch (error) {
      console.error('Failed to send collaboration notification email:', error);
    }

    return { message: 'Collaboration request sent successfully', request };
  }

  // APPROVE COLLABORATION REQUEST
  async approveRequest(requestId: string) {
    const request = await this.requestModel.findById(requestId);
    if (!request) throw new NotFoundException('Request not found');

    const project = await this.projectModel.findById(request.project);
    if (!project) throw new NotFoundException('Associated project not found');

    if (project.teamMembers.length >= project.teamSize) {
      throw new BadRequestException('Cannot approve request. Team limit reached.');
    }

    request.status = 'approved';
    await request.save();

    await this.projectModel.findByIdAndUpdate(request.project, {
      $addToSet: { teamMembers: request.requester },
      collaborationActive: true,
    });

    return { message: 'Collaboration approved successfully' };
  }

  // REJECT COLLABORATION REQUEST
  async rejectRequest(requestId: string) {
    const request = await this.requestModel.findById(requestId);
    if (!request) throw new NotFoundException('Request not found');

    request.status = 'rejected';
    await request.save();

    return { message: 'Collaboration rejected successfully' };
  }

  // GET NOTIFICATIONS
  async getNotifications(ownerId: string) {
    const requests = await this.requestModel
      .find({ projectOwner: ownerId, status: 'pending' })
      .populate('requester', 'name email')
      .populate('project', 'title');

    return { message: 'Notifications fetched successfully', total: requests.length, requests };
  }
}
