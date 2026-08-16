import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembershipRegister } from './membership-register.entity';
import { MembershipRegisterController } from './membership-register.controller';
import { MembershipRegisterService } from './membership-register.service';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipRegister])],
  controllers: [MembershipRegisterController],
  providers: [MembershipRegisterService],
  exports: [MembershipRegisterService],
})
export class MembershipRegisterModule {}