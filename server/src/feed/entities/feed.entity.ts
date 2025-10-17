import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Feed extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  // createdAt & updatedAt are automatically added by timestamps:true
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
