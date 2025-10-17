import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
