import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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

  // ==========================================
  // REGISTER
  // ==========================================

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
    return this.matrimonialUsersService.register(
      data,
      photo,
    );
  }

  // ==========================================
  // GET ALL
  // ==========================================

  @Get()
  async findAll() {
    return this.matrimonialUsersService.findAll();
  }

  // ==========================================
  // GET ONE
  // ==========================================

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.matrimonialUsersService.findOne(id);
  }

  // ==========================================
  // UPDATE
  // ==========================================

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
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.matrimonialUsersService.update(
      id,
      data,
      photo,
    );
  }
}