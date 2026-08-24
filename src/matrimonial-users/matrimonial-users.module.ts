import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MatrimonialUsersController } from './matrimonial-users.controller';

import { MatrimonialUsersService } from './matrimonial-users.service';

import { MatrimonialUser } from './entities/matrimonial-user.entity';

import { Member } from '../members/entity/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatrimonialUser,
      Member,
    ]),
  ],

  controllers: [
    MatrimonialUsersController,
  ],

  providers: [
    MatrimonialUsersService,
  ],

  exports: [
    MatrimonialUsersService,
  ],
})
export class MatrimonialUsersModule {}