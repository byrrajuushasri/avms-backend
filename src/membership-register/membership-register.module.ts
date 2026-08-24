import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembershipRegisterController } from './membership-register.controller';
import { MembershipRegisterService } from './membership-register.service';
import { MembershipRegister } from './entities/membership-register.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MembershipRegister,
    ]),
  ],

  controllers: [
    MembershipRegisterController,
  ],

  providers: [
    MembershipRegisterService,
  ],

  exports: [
    MembershipRegisterService,
  ],
})
export class MembershipRegisterModule {}