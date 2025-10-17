import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feed } from './entities/feed.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Feed.name) private feedModel: Model<Feed>,
  ) {}

  async create(createFeedDto: CreateFeedDto): Promise<Feed> {
    const newFeed = new this.feedModel(createFeedDto);
    return newFeed.save();
  }

  async findAll(): Promise<Feed[]> {
    return this.feedModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Feed> {
    const feed = await this.feedModel.findById(id).exec();
    if (!feed) throw new NotFoundException(`Feed #${id} not found`);
    return feed;
  }

  async update(id: string, updateFeedDto: UpdateFeedDto): Promise<Feed> {
    const updated = await this.feedModel
      .findByIdAndUpdate(id, updateFeedDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Feed #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.feedModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Feed #${id} not found`);
  }
}
