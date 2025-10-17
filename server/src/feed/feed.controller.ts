import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // Create a new post
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Req() req, @Body() createFeedDto: CreateFeedDto) {
    // attach user ID from token before passing to service
    return this.feedService.create(req.user._id, createFeedDto);
  }

  // Get all posts
  @Get()
  findAll() {
    return this.feedService.findAll();
  }

  // Get logged-in user’s own posts
  @UseGuards(JwtAuthGuard)
  @Get('my-posts')
  findMyPosts(@Req() req) {
    return this.feedService.findByUser(req.user._id);
  }

  // Get a specific post by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedService.findOne(id);
  }

  // Update a post
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateFeedDto: UpdateFeedDto,
  ) {
    return this.feedService.update(req.user, id, updateFeedDto);
  }

  // Delete a post
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedService.remove(id);
  }
}
