import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

import { Membership } from './entity/membership.entity';
import { Member } from '../members/entity/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Membership,
      Member,
    ]),
  ],

  controllers: [
    MembershipController,
  ],

  providers: [
    MembershipService,
  ],

  exports: [
    MembershipService,
  ],
})
export class MembershipModule {}