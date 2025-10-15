import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<{ secure_url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'user_avatars' },
        (error?: Error, result?: UploadApiResponse) => {
          if (error) {
            return reject(new BadRequestException(`Cloudinary upload failed: ${error.message}`));
          }

          if (!result || !result.secure_url) {
            return reject(new BadRequestException('Invalid Cloudinary response'));
          }

          resolve({ secure_url: result.secure_url });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
