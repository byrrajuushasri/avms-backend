import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { MembershipRegisterService } from './membership-register.service';

import { CreateMembershipRegisterDto } from './dto/create-membership-register.dto';
import { UpdateMembershipRegisterDto } from './dto/update-membership-register.dto';
import { StorageService } from '../storage/storage.service';
import { normalizeMembershipMobileNumber } from './mobile-number';
import type { Request } from 'express';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { getActivityLogContext } from '../activity-logs/activity-log-context';

// =========================================================
// IMAGE UPLOAD CONFIGURATION
// =========================================================

const photoUploadOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowed.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          'Only JPG, JPEG, PNG or WEBP images are allowed',
        ),
        false,
      );
    }
  },
};

@Controller('membership-register')
export class MembershipRegisterController {
  constructor(
    private readonly membershipService: MembershipRegisterService,
    private readonly storageService: StorageService,
  ) {}

  // CREATE MEMBER
  // POST /membership-register

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions))
  async create(
    @Body() dto: CreateMembershipRegisterDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const validatedDto = {
      ...dto,
      mobile: normalizeMembershipMobileNumber(dto.mobile),
    };

    const uploaded = file
      ? await this.storageService.uploadImage(file, 'members')
      : undefined;

    const photoPath = uploaded?.key;

    return this.membershipService.create(
      validatedDto,
      photoPath,
      getActivityLogContext(req),
    );
  }

  // GET ALL MEMBERS
  // GET /membership-register

  @Get()
  async findAll(
    @Query('sangham') sangham?: string,
    @Query('role') role?: string,
  ) {
    return this.membershipService.findAll(sangham, role);
  }

  // PUBLIC EXECUTIVES
  // GET /membership-register/public/executives

  @Get('public/executives')
  async findPublicExecutives() {
    return this.membershipService.findPublicExecutives();
  }

  // GET ONE MEMBER
  // GET /membership-register/:id

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membershipService.findOne(id);
  }

  // DELETE MEMBER
  // DELETE /membership-register/:id

  @Delete(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.membershipService.remove(id, getActivityLogContext(req));
  }

  // UPDATE MEMBER
  // PUT /membership-register/:id

  @Put(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMembershipRegisterDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const validatedDto = {
      ...dto,
      ...(dto.mobile !== undefined &&
      dto.mobile !== null &&
      String(dto.mobile).trim() !== ''
        ? {
            mobile: normalizeMembershipMobileNumber(String(dto.mobile)),
          }
        : {}),
    };

    const uploaded = file
      ? await this.storageService.uploadImage(file, 'members')
      : undefined;

    const photoPath = uploaded?.key;

    return this.membershipService.update(
      id,
      validatedDto,
      photoPath,
      getActivityLogContext(req),
    );
  }
}
