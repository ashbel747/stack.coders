import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/auth.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private cloudinary: CloudinaryService,
  ) {}

  // SIGNUP
  async signup(signupDto: SignupDto, file?: Express.Multer.File) {
    const { name, email, skills, password, confirmPassword } = signupDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl = '';
    if (file) {
      const uploadResult = await this.cloudinary.uploadImage(file);
      avatarUrl = uploadResult.secure_url;
    }

    const user = await this.userModel.create({
      name,
      email,
      skills,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    const token = this.jwtService.sign({ id: user._id });

    return {
      message: 'Signup successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        avatar: user.avatar,
      },
    };
  }

  // LOGIN
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        avatar: user.avatar,
      },
    };
  }

  // GET ALL USERS (Admin only ideally)
  async getAllUsers() {
    return this.userModel.find().select('-password');
  }

  // GET PROFILE
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // UPDATE PROFILE
  async updateProfile(
    userId: string,
    updateDto: UpdateAuthDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (file) {
      const uploadResult = await this.cloudinary.uploadImage(file);
      updateDto.avatar = uploadResult.secure_url;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateDto, { new: true })
      .select('-password');

    return { message: 'Profile updated successfully', user: updatedUser };
  }

  // DELETE PROFILE
  async deleteProfile(userId: string) {
    const deleted = await this.userModel.findByIdAndDelete(userId);
    if (!deleted) throw new NotFoundException('User not found');
    return { message: 'Profile deleted successfully' };
  }
}