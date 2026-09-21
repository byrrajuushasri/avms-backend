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

  @Post()
  create(
    @Body() createMembershipDto: CreateMembershipDto,
  ) {
    return this.membershipService.create(createMembershipDto);
  }

  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  @Get('member/:member_id')
  findByMemberId(
    @Param('member_id') member_id: string,
  ) {
    return this.membershipService.findByMemberId(member_id);
  }

  // ✅ UPDATE MEMBER PROFILE
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
    return this.membershipService.updateMemberProfile(id, body);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.membershipService.findOne(id);
  }
}