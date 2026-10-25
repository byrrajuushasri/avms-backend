
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { randomUUID } from 'crypto';
import { s3Client } from './s3-client';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



@Injectable()
export class StorageService {
  async uploadImage(
    file: Express.Multer.File,
    folder: 'members' | 'matrimonial' | 'blog',
  ): Promise<{ key: string }> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Image file is required');
    }
  console.log('S3 CONFIG CHECK:', {
    endpointLoaded: Boolean(process.env.AWS_ENDPOINT_URL),
    bucketLoaded: Boolean(process.env.AWS_S3_BUCKET_NAME),
    regionLoaded: Boolean(process.env.AWS_DEFAULT_REGION),
    accessKeyLoaded: Boolean(process.env.AWS_ACCESS_KEY_ID?.trim()),
    secretKeyLoaded: Boolean(process.env.AWS_SECRET_ACCESS_KEY?.trim()),
  });
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, and WebP images are allowed',
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException(
        'Image size must be 5 MB or less',
      );
    }

    const extensionByType: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    const key = `${folder}/${randomUUID()}.${extensionByType[file.mimetype]}`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      console.log('Storage upload successful:', {
        key,
        contentType: file.mimetype,
        size: file.size,
      });

      return { key };
    } catch (error: unknown) {
      const err = error as {
        name?: string;
        message?: string;
        $metadata?: {
          httpStatusCode?: number;
        };
      };

      console.error('STORAGE BUCKET UPLOAD ERROR:', {
        name: err?.name,
        message: err?.message,
        statusCode: err?.$metadata?.httpStatusCode,
      });

      throw new InternalServerErrorException(
        'Image upload failed',
      );
    }
  }

  async deleteImage(key: string): Promise<void> {
    if (!key) return;

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      }),
    );
  }


  async getImageUrl(key: string): Promise<string> {
  if (!key) {
    throw new BadRequestException('Image key is required');
  }

  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 300 },
  );
}
}
