import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsArray } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  deadline?: Date;

  @IsArray()
  @IsOptional()
  requiredSkills?: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsInt()
  @Min(1)
  teamSize: number;

  @IsOptional()
  @IsArray()
  techStack?: string[];

  @IsOptional()
  @IsString()
  githubRepo?: string;
}
