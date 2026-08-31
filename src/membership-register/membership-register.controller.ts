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

import { MembershipRegisterService } from './membership-register.service';

import { CreateMembershipRegisterDto } from './dto/create-membership-register.dto';
import { UpdateMembershipRegisterDto } from './dto/update-membership-register.dto';

@Controller('membership-register')
export class MembershipRegisterController {
  constructor(
    private readonly membershipService: MembershipRegisterService,
  ) {}

  // =========================================================
  // CREATE
  // POST /membership-register
  // =========================================================

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/members',
        filename: (req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(
              file.originalname,
            )}`;

          callback(null, uniqueName);
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (req, file, callback) => {
        const allowed = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ];

        if (allowed.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error(
              'Only JPG, JPEG, PNG or WEBP images are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  async create(
    @Body() dto: CreateMembershipRegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('CREATE DTO:', dto);
    console.log('CREATE FILE:', file?.filename);

    const photoPath = file
      ? `/uploads/members/${file.filename}`
      : undefined;

    return this.membershipService.create(dto, photoPath);
  }

  // =========================================================
  // GET ALL MEMBERS
  // GET /membership-register
  // =========================================================

  @Get()
  async findAll(
    @Query('sangham') sangham?: string,
    @Query('role') role?: string,
  ) {
    console.log('GET MEMBERS');
    console.log('ROLE:', role);
    console.log('SANGHAM:', sangham);

    return this.membershipService.findAll(
      sangham,
      role,
    );
  }

  // =========================================================
  // PUBLIC EXECUTIVES
  // GET /membership-register/public/executives
  // =========================================================

  @Get('public/executives')
  async findPublicExecutives() {
    return this.membershipService.findPublicExecutives();
  }

  // =========================================================
  // GET ONE MEMBER
  // GET /membership-register/:id
  // =========================================================

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.membershipService.findOne(id);
  }

  // =========================================================
  // DELETE MEMBER
  // DELETE /membership-register/:id
  // =========================================================

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log('DELETE MEMBER ID:', id);

    return this.membershipService.remove(id);
  }

  // =========================================================
  // UPDATE MEMBER
  // PUT /membership-register/:id
  // =========================================================

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/members',

        filename: (req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(
              file.originalname,
            )}`;

          callback(null, uniqueName);
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (req, file, callback) => {
        const allowed = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ];

        if (allowed.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error(
              'Only JPG, JPEG, PNG or WEBP images are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMembershipRegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('UPDATE MEMBER ID:', id);
    console.log('UPDATE DTO:', dto);
    console.log('UPDATE FILE:', file?.filename);

    if (!dto) {
      dto = {} as UpdateMembershipRegisterDto;
    }

    const photoPath = file
      ? `/uploads/members/${file.filename}`
      : undefined;

    return this.membershipService.update(
      id,
      dto,
      photoPath,
    );
  }
}