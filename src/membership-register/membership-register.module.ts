import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembershipRegisterController } from './membership-register.controller';
import { MembershipRegisterService } from './membership-register.service';
import { MembershipRegister } from './entities/membership-register.entity';

import { EmailModule } from '../email/email.module';
import { StorageModule } from '../storage/storage.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipRegister]),
    EmailModule,
    StorageModule,
    ActivityLogsModule,
  ],
  controllers: [MembershipRegisterController],
  providers: [MembershipRegisterService],
  exports: [MembershipRegisterService],
})
export class MembershipRegisterModule {}
