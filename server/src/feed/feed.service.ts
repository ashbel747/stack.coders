import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feed } from './entities/feed.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
  ) {}

  // Create a new feed post
  async create(userId: string, createFeedDto: CreateFeedDto): Promise<Feed> {
    const newFeed = new this.feedModel({
      ...createFeedDto,
      createdAt: new Date(),
    });
    return newFeed.save();
  }

  // Get all feed posts (Public)
  async findAll(): Promise<Feed[]> {
    return this.feedModel.find().sort({ createdAt: -1 }).exec();
  }

  // Get a single feed post by ID
  async findOne(id: string): Promise<Feed> {
    const feed = await this.feedModel.findById(id).exec();
    if (!feed) throw new NotFoundException('Feed post not found');
    return feed;
  }

  // Get all posts by logged-in user — disabled since no user field exists
  async findByUser(userId: string): Promise<Feed[]> {
    return this.feedModel.find().sort({ createdAt: -1 }).exec();
  }


  // Update a feed post
  async update(user: any, id: string, updateFeedDto: UpdateFeedDto): Promise<Feed> {
    const feed = await this.feedModel.findById(id);
    if (!feed) throw new NotFoundException('Feed post not found');

    Object.assign(feed, updateFeedDto);
    return feed.save();
  }

  // Delete a feed post
  async remove(id: string): Promise<{ message: string }> {
    const feed = await this.feedModel.findByIdAndDelete(id);
    if (!feed) throw new NotFoundException('Feed post not found');
    return { message: 'Feed post deleted successfully' };
  }
}
