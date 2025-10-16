import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './entities/project.entity';
import { CollaborationRequest } from './entities/collab-request.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(CollaborationRequest.name)
    private requestModel: Model<CollaborationRequest>,
  ) {}

  // CREATE PROJECT
  async createProject(dto: CreateProjectDto, ownerId: string) {
    const project = await this.projectModel.create({
      ...dto,
      owner: new Types.ObjectId(ownerId),
    });

    return {
      message: 'Project created successfully',
      project,
    };
  }

  // GET ALL PROJECTS
  async getAllProjects() {
    return this.projectModel
      .find()
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email');
  }

  // GET PROJECT BY ID
  async getProjectById(id: string) {
    const project = await this.projectModel
      .findById(id)
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email');

    if (!project) throw new NotFoundException('Project not found');
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

    return {
      message: 'Your projects fetched successfully',
      total: projects.length,
      projects,
    };
  }


  // UPDATE PROJECT (only owner)
  async updateProject(id: string, dto: UpdateProjectDto, userId: string) {
    const project = await this.projectModel.findById(id);
    if (!project) throw new NotFoundException('Project not found');

    if (project.owner.toString() !== userId.toString()) {
      throw new BadRequestException('You are not authorized to update this project');
    }

    const updated = await this.projectModel.findByIdAndUpdate(id, dto, { new: true });
    return { message: 'Project updated successfully', project: updated };
  }

  // DELETE PROJECT (only owner can delete)
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
    const project = await this.projectModel.findById(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const existing = await this.requestModel.findOne({
      project: projectId,
      requester: requesterId,
    });

    if (existing) {
      return { message: 'You have already sent a collaboration request for this project' };
    }

    const request = await this.requestModel.create({
      requester: new Types.ObjectId(requesterId),
      project: new Types.ObjectId(projectId),
      projectOwner: project.owner,
      status: 'pending',
    });

    return { message: 'Collaboration request sent successfully', request };
  }

  // APPROVE COLLABORATION REQUEST
  async approveRequest(requestId: string) {
    const request = await this.requestModel.findById(requestId);
    if (!request) throw new NotFoundException('Request not found');

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

  // GET NOTIFICATIONS (pending requests)
  async getNotifications(ownerId: string) {
    const requests = await this.requestModel
      .find({ projectOwner: ownerId, status: 'pending' })
      .populate('requester', 'name email')
      .populate('project', 'title');

    return {
      message: 'Notifications fetched successfully',
      total: requests.length,
      requests,
    };
  }
}
