import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class ApproveRequestDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsIn(['approved', 'rejected'])
  action: string; // 'approved' or 'rejected'
}
