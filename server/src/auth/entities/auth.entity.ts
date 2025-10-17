import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false })
  phone: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: ['dev', 'admin'], default: 'dev' })
  role: string;

  @Prop()
  resetCode?: string; // For forgot password

  @Prop()
  resetCodeExpires?: Date; // Expiry time for reset code
}

export const UserSchema = SchemaFactory.createForClass(User);
