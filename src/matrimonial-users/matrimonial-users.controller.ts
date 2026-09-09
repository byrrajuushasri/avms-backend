import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { MatrimonialUsersService } from './matrimonial-users.service';

@Controller('matrimonial-users')
export class MatrimonialUsersController {
  constructor(
    private readonly matrimonialUsersService: MatrimonialUsersService,
  ) {}

  // =====================================================
  // REGISTER MATRIMONIAL PROFILE
  // =====================================================

  @Post('register')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/matrimonial',

        filename: (req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),

      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new Error('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },

      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async register(
    @Body() data: any,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    console.log('========== REGISTER PHOTO ==========');
    console.log('Photo:', photo?.filename || 'No photo');

    return this.matrimonialUsersService.register(
      data,
      photo,
    );
  }

  // =====================================================
  // CHECK MEMBERSHIP BEFORE MATRIMONY
  // =====================================================

  @Post('check-member')
  async checkMember(
    @Body()
    data: {
      mobile?: string;
      email?: string;
    },
  ) {
    return this.matrimonialUsersService.checkMember(data);
  }

  // =====================================================
  // GET ALL MATRIMONIAL USERS
  // =====================================================

  @Get()
  async findAll() {
    return this.matrimonialUsersService.findAll();
  }

  // =====================================================
  // GET ONE MATRIMONIAL USER
  // =====================================================

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.matrimonialUsersService.findOne(id);
  }

  // =====================================================
  // UPDATE MATRIMONIAL USER
  // =====================================================

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/matrimonial',

        filename: (req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),

      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new Error('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },

      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,

    @Body() data: any,

    @UploadedFile()
    photo?: Express.Multer.File,
  ) {
    console.log('========== UPDATE PHOTO ==========');
    console.log('Matrimonial ID:', id);
    console.log(
      'Uploaded Photo:',
      photo?.filename || 'NO PHOTO',
    );

    return this.matrimonialUsersService.update(
      id,
      data,
      photo,
    );
  }

  // =====================================================
  // DELETE MATRIMONIAL USER
  // =====================================================

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.matrimonialUsersService.remove(id);
  }
}