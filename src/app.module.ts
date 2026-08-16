import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatrimonialUsersModule } from './matrimonial-users/matrimonial-users.module';
import { MembershipRegisterModule } from './membership-register/membership-register.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'matrimonial_db',
      autoLoadEntities: true,
      synchronize: false,
    }),

    // Matrimonial Users
    MatrimonialUsersModule,

    // Membership Register
    MembershipRegisterModule,

    // Admin Users
    UsersModule,
  ],
})
export class AppModule {}