import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsArray,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^\+?\d{7,15}$/, {
    message: 'Phone number must be valid and include country code if needed',
  })
  phone: string; // 👈 Added phone number

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

  @IsOptional()
  @IsString()
  role: string = 'dev'; // defaults to "dev"
}
