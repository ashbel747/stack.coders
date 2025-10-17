import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  UseGuards,
  Req,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('avatar')) // 👈 use 'avatar' not 'file'
  signup(@UploadedFile() file: Express.Multer.File, @Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto, file);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Forgot password (send reset code)
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // Verify reset code
  @Post('verify-code')
  verifyCode(@Body() body: { email: string; code: string }) {
    return this.authService.verifyResetCode(body.email, body.code);
  }

  // Reset password
  @Post('reset-password')
  resetPassword(
    @Body()
    body: {
      email: string;
      code: string;
      newPassword: string;
      confirmPassword: string;
    },
  ) {
    return this.authService.resetPassword(
      body.email,
      body.code,
      body.newPassword,
      body.confirmPassword,
    );
  }

  // Authenticated users can view any user's profile by ID
  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getUserProfile(@Param('id') id: string, @Req() req) {
    return this.authService.getUserProfile(id);
  }

  // VIEW YOUR PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user._id);
  }

  // UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(FileInterceptor('avatar'))
  updateProfile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDto: UpdateAuthDto,
  ) {
    return this.authService.updateProfile(req.user._id, updateDto, file);
  }

  // DELETE PROFILE
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  deleteProfile(@Req() req) {
    return this.authService.deleteProfile(req.user._id);
  }

  // GET ALL USERS - Admin only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all')
  getAllUsers() {
    return this.authService.getAllUsers();
  }
}
