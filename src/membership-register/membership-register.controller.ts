import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { MembershipRegisterService } from './membership-register.service';
import { CreateMembershipRegisterDto } from './dto/create-membership-register.dto';

@Controller('membership-register')
export class MembershipRegisterController {
  constructor(
    private readonly membershipRegisterService: MembershipRegisterService,
  ) {}

  // =========================
  // CREATE MEMBER
  // =========================
  @Post()
  async create(
    @Body()
    createMembershipRegisterDto: CreateMembershipRegisterDto,
  ) {
    return await this.membershipRegisterService.create(
      createMembershipRegisterDto,
    );
  }

  // =========================
  // GET ALL MEMBERS
  // =========================
  @Get()
  async findAll() {
    return await this.membershipRegisterService.findAll();
  }

  // =========================
  // GET MEMBER BY ID
  // =========================
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.membershipRegisterService.findOne(
      id,
    );
  }

  // =========================
  // UPDATE MEMBER
  // =========================
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateMembershipRegisterDto: CreateMembershipRegisterDto,
  ) {
    return await this.membershipRegisterService.update(
      id,
      updateMembershipRegisterDto,
    );
  }
}