import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { ReplyContactMessageDto } from './dto/reply-contact-message.dto';
import { ContactMessagesService } from './contact-messages.service';

const ADMIN_ROLES = [
  'admin',
  'super_admin',
  'state_admin',
  'district_admin',
  'mandal_admin',
  'sangam_admin',
];

@Controller('contact-messages')
export class ContactMessagesController {
  constructor(
    private readonly contactMessagesService: ContactMessagesService,
  ) {}

  @Post()
  create(@Body() dto: CreateContactMessageDto) {
    return this.contactMessagesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  findAll() {
    return this.contactMessagesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactMessagesService.findOne(id);
  }

  @Patch(':id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  reply(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplyContactMessageDto,
  ) {
    return this.contactMessagesService.reply(id, dto.reply);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactMessagesService.remove(id);
  }
}
