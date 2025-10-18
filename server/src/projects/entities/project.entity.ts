import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  deadline: Date;

  @Prop({ type: [String] })
  requiredSkills: string[];

  @Prop()
  category: string;

  @Prop({ required: true })
  teamSize: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  teamMembers: Types.ObjectId[];

  @Prop({ default: false })
  collaborationActive: boolean;

  @Prop()
  githubRepo?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);