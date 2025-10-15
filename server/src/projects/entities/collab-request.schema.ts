import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CollaborationRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requester: Types.ObjectId; // User who sent the request

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  projectOwner: Types.ObjectId;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: string;
}

export const CollaborationRequestSchema =
  SchemaFactory.createForClass(CollaborationRequest);
