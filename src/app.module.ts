import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatrimonialUsersModule } from './matrimonial-users/matrimonial-users.module';
import { MembershipRegisterModule } from './membership-register/membership-register.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
      }),
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