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
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private cloudinary: CloudinaryService,
    private mailService: MailService,
  ) {}

  // SIGNUP
  async signup(signupDto: SignupDto, file?: Express.Multer.File) {
    const { name, email, phone, skills, password, confirmPassword, role } = signupDto;

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
      phone,
      skills,
      password: hashedPassword,
      avatar: avatarUrl,
      role: role || 'dev',
    });

    const token = this.jwtService.sign({ id: user._id });

    return {
      message: 'Signup successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone:user.phone,
        role:user.role,
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

  //FORGOT PASSWORD
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    const resetCode = randomBytes(3).toString('hex').toUpperCase(); // e.g. "A9F2C3"
    const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    // Send email
    await this.mailService.sendContactEmail(
      'Password Reset',
      email,
      `Your password reset code is <b>${resetCode}</b>. It expires in 10 minutes.`,
    );

    return { message: 'Reset code sent to your email' };
  }

  // VERIFY RESET CODE
  async verifyResetCode(email: string, code: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (
      !user.resetCodeExpires ||
      !user.resetCode ||
      user.resetCode !== code ||
      user.resetCodeExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    return { message: 'Code verified successfully' };
  }

  // RESET PASSWORD
  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (
      !user.resetCodeExpires ||
      !user.resetCode ||
      user.resetCode !== code ||
      user.resetCodeExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset code');
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    return { message: 'Password reset successful' };
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