import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Controller('membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
  ) {}

  // ============================================
  // CREATE
  // POST /membership
  // ============================================

  @Post()
  create(
    @Body() createMembershipDto: CreateMembershipDto,
  ) {
    return this.membershipService.create(
      createMembershipDto,
    );
  }

  // ============================================
  // GET ALL
  // GET /membership
  // ============================================

  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  // ============================================
  // GET BY MEMBER ID
  // GET /membership/member/TVM00006
  // ============================================

  @Get('member/:member_id')
  findByMemberId(
    @Param('member_id') member_id: string,
  ) {
    return this.membershipService.findByMemberId(
      member_id,
    );
  }

  // ============================================
  // GET BY ID
  // GET /membership/1
  // ============================================

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.membershipService.findOne(id);
  }
}