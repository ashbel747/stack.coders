import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // CREATE PROJECT
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createProject(@Req() req, @Body() dto: CreateProjectDto) {
    return this.projectService.createProject(dto, req.user._id);
  }

  // FETCH ALL PROJECTS
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllProjects(@Req() req) {
    const userId = req.user.id || req.user._id;
    return this.projectService.getAllProjects(userId);
  }

  // GET NOTIFICATIONS (pending collaboration requests)
  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async getNotifications(@Req() req) {
    return this.projectService.getNotifications(req.user._id);
  }

  // GET MY PROJECTS (projects owned by logged-in user)
  @UseGuards(JwtAuthGuard)
  @Get('personal')
  getMyProjects(@Req() req) {
    const userId = req.user.id || req.user._id;
    return this.projectService.getMyProjects(userId);
  }

  // GET PROJECT BY ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProjectById(@Param('id') id: string, @Req() req) {
    const userId = req.user.id || req.user._id;
    return this.projectService.getProjectById(id, userId);
  }


  // UPDATE PROJECT (only owner can)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateProject(@Param('id') id: string, @Req() req, @Body() dto: UpdateProjectDto) {
    const userId = req.user.id || req.user._id; // normalize user ID
    return this.projectService.updateProject(id, dto, userId);
  }

  // DELETE PROJECT (only owner)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteProject(@Param('id') id: string, @Req() req) {
    const userId = req.user.id || req.user._id;
    return this.projectService.deleteProject(id, userId);
  }


  // REQUEST COLLABORATION
  @UseGuards(JwtAuthGuard)
  @Post(':id/request')
  async requestCollaboration(@Param('id') id: string, @Req() req) {
    const userId = req.user.id || req.user._id;
    return this.projectService.requestCollaboration(id, userId);
  }

  // APPROVE COLLABORATION REQUEST
  @UseGuards(JwtAuthGuard)
  @Post('requests/:id/approve')
  async approveRequest(@Param('id') id: string) {
    return this.projectService.approveRequest(id);
  }

  // REJECT COLLABORATION REQUEST
  @UseGuards(JwtAuthGuard)
  @Post('requests/:id/reject')
  async rejectRequest(@Param('id') id: string) {
    return this.projectService.rejectRequest(id);
  }
}
