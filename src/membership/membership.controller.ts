import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
  // CREATE MEMBERSHIP
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
  // GET ALL MEMBERSHIPS
  // ============================================

  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  // ============================================
  // GET MEMBERSHIP BY MEMBER ID
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
  // UPDATE MEMBER PROFILE
  //
  // PATCH /membership/member/:id
  // ============================================

  @Patch('member/:id')
  updateMemberProfile(
    @Param('id', ParseIntPipe) id: number,

    @Body()
    body: {
      full_name: string;
      email: string;
      mobile: string;
    },
  ) {
    return this.membershipService.updateMemberProfile(
      id,
      body,
    );
  }

  // ============================================
  // AUTHORIZE MEMBER FOR MATRIMONY
  //
  // PATCH
  // /membership/member/:id/authorize-matrimony
  //
  // Body:
  // {
  //   "expiryDate": "2026-12-31"
  // }
  // ============================================

  @Patch(
    'member/:id/authorize-matrimony',
  )
  authorizeMatrimony(
    @Param('id', ParseIntPipe) id: number,

    @Body()
    body: {
      expiryDate: string;
    },
  ) {
    return this.membershipService.authorizeMatrimony(
      id,
      body.expiryDate,
    );
  }

  // ============================================
  // GET MEMBERSHIP BY DATABASE ID
  // ============================================

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.membershipService.findOne(id);
  }
}