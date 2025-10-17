import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { Feed, FeedSchema } from './entities/feed.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
