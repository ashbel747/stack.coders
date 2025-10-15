import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignupDto {
  @IsNotEmpty()
  name: string;

  // Make avatar optional since it’s a file upload
  @IsOptional()
  avatar?: string;

  @IsEmail()
  email: string;

  // Accept both arrays and comma-separated strings
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return value;
  })
  @IsArray()
  skills: string[];

  @MinLength(6)
  password: string;

  @MinLength(6)
  confirmPassword: string;
}
