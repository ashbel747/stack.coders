import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './entities/auth.entity';
import * as dotenv from 'dotenv';
import type { StringValue } from 'ms';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MailModule } from '../mail/mail.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || '7d',
      },
    }),
    CloudinaryModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CloudinaryService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
