import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActivityLog } from './activity-log.entity';
import type { ActivityLogInput } from './activity-log.types';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async record(input: ActivityLogInput): Promise<ActivityLog> {
    const log = this.activityLogRepository.create({
      user_id: input.userId ?? null,
      user_name: input.userName?.slice(0, 150) ?? null,
      action: input.action.slice(0, 100),
      module: input.module.slice(0, 100),
      description: input.description,
      ip_address: input.ipAddress?.slice(0, 50) ?? null,
    });

    return this.activityLogRepository.save(log);
  }

  async findLatest(page = 1, limit = 10) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 200);
    const [items, total] = await this.activityLogRepository.findAndCount({
      order: { created_at: 'DESC', id: 'DESC' },
      take: safeLimit,
      skip: (safePage - 1) * safeLimit,
    });

    return {
      items,
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    };
  }
}
