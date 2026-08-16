import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatrimonialUsersController } from './matrimonial-users.controller';
import { MatrimonialUsersService } from './matrimonial-users.service';
import { MatrimonialUser } from './entities/matrimonial-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatrimonialUser]),
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