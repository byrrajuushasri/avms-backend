import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatrimonialUsersController } from './matrimonial-users.controller';
import { MatrimonialUsersService } from './matrimonial-users.service';
import { MatrimonialProfileOwnerGuard } from './matrimonial-profile-owner.guard';

import { MatrimonialUser } from './entities/matrimonial-user.entity';
import { MatrimonialInterestRequest } from './entities/matrimonial-interest-request.entity';
import { MembershipRegister } from '../membership-register/entities/membership-register.entity';

import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatrimonialUser,
      MatrimonialInterestRequest,
      MembershipRegister,
    ]),

    EmailModule,
  ],

  controllers: [MatrimonialUsersController],

  providers: [MatrimonialUsersService, MatrimonialProfileOwnerGuard],

  exports: [MatrimonialUsersService],
})
export class MatrimonialUsersModule {}
