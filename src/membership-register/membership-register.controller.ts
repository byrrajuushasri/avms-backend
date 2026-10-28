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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { MembershipRegisterService } from './membership-register.service';

import { CreateMembershipRegisterDto } from './dto/create-membership-register.dto';
import { UpdateMembershipRegisterDto } from './dto/update-membership-register.dto';
import { StorageService } from '../storage/storage.service';

// =========================================================
// MOBILE NUMBER VALIDATION
// =========================================================

function validateMobileNumber(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new BadRequestException('Mobile number is required.');
  }

  let mobile = value.trim().replace(/[\s()-]/g, '');

  if (mobile.startsWith('+91')) {
    mobile = mobile.slice(3);
  } else if (mobile.startsWith('91') && mobile.length === 12) {
    mobile = mobile.slice(2);
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    throw new BadRequestException(
      'Please enter a valid 10-digit Indian mobile number.',
    );
  }

  return mobile;
}

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
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions))
  async create(
    @Body() dto: CreateMembershipRegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const validatedDto = {
      ...dto,
      mobile: validateMobileNumber(dto.mobile),
    };

    const uploaded = file
      ? await this.storageService.uploadImage(file, 'members')
      : undefined;

    const photoPath = uploaded?.key;

    return this.membershipService.create(validatedDto, photoPath);
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.membershipService.remove(id);
  }

  // UPDATE MEMBER
  // PUT /membership-register/:id

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMembershipRegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const validatedDto = {
      ...dto,
      ...(dto.mobile !== undefined &&
      dto.mobile !== null &&
      String(dto.mobile).trim() !== ''
        ? {
            mobile: validateMobileNumber(String(dto.mobile)),
          }
        : {}),
    };

    const uploaded = file
      ? await this.storageService.uploadImage(file, 'members')
      : undefined;

    const photoPath = uploaded?.key;

    return this.membershipService.update(id, validatedDto, photoPath);
  }
}
