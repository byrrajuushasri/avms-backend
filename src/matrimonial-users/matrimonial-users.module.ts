import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatrimonialUsersController } from './matrimonial-users.controller';
import { MatrimonialUsersService } from './matrimonial-users.service';
import { MatrimonialProfileOwnerGuard } from './matrimonial-profile-owner.guard';

import { MatrimonialUser } from './entities/matrimonial-user.entity';
import { MatrimonialInterestRequest } from './entities/matrimonial-interest-request.entity';
import { MembershipRegister } from '../membership-register/entities/membership-register.entity';

import { EmailModule } from '../email/email.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatrimonialUser,
      MatrimonialInterestRequest,
      MembershipRegister,
    ]),

    EmailModule,
    ActivityLogsModule,
    AuthModule,
  ],

  controllers: [MatrimonialUsersController],

  providers: [
    MatrimonialUsersService,
    MatrimonialProfileOwnerGuard,
    JwtAuthGuard,
    RolesGuard,
  ],

  exports: [MatrimonialUsersService],
})
export class MatrimonialUsersModule {}
