import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { getActivityLogContext } from './activity-log-context';
import { ActivityLogsService } from './activity-logs.service';

@Controller('activity-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  'admin',
  'super_admin',
  'state_admin',
  'district_admin',
  'mandal_admin',
  'sangam_admin',
)
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  findLatest(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.activityLogsService.findLatest(page, limit);
  }

  @Post('logout')
  recordLogout(@Req() req: Request) {
    return this.activityLogsService.record({
      ...getActivityLogContext(req),
      action: 'logout',
      module: 'auth',
      description: 'User logged out.',
    });
  }
}
