import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import {
  diskStorage,
} from 'multer';

import {
  extname,
} from 'path';

import {
  CreateMembershipRegisterDto,
} from './dto/create-membership-register.dto';

import {
  MembershipRegisterService,
} from './membership-register.service';

@Controller('membership-register')
export class MembershipRegisterController {
  constructor(
    private readonly membershipRegisterService: MembershipRegisterService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/members',

        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}${extname(file.originalname)}`;

          callback(null, uniqueName);
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ];

        if (
          allowedTypes.includes(file.mimetype)
        ) {
          callback(null, true);
        } else {
          callback(
            new Error(
              'Only JPG, JPEG, PNG and WEBP images are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  async create(
    @Body() dto: CreateMembershipRegisterDto,

    @UploadedFile()
    photo?: Express.Multer.File,
  ) {
    const photoPath = photo
      ? `/uploads/members/${photo.filename}`
      : undefined;

    return this.membershipRegisterService.create(
      dto,
      photoPath,
    );
  }

  @Get()
  async findAll() {
    return this.membershipRegisterService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.membershipRegisterService.findOne(id);
  }
}