import { IsNotEmpty, IsString } from 'class-validator';

export class CollaborationRequestDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
