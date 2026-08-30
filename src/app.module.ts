import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatrimonialUsersModule } from './matrimonial-users/matrimonial-users.module';
import { MembershipRegisterModule } from './membership-register/membership-register.module';
import { UsersModule } from './users/users.module';
import { MembershipModule } from './membership/membership.module';
import { NewsModule } from './news/news.module';
import { ExecutiveBodiesModule } from './executive-bodies/executive-bodies.module';
import { LocationsModule } from './locations/locations.module';
import { TemplesModule } from "./temples/temples.module";
import { TempleEventsModule } from "./temple-events/temple-events.module";
import { SatramsModule } from "./satrams/satrams.module";
import { AuthModule } from "./auth/auth.module";

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

    MatrimonialUsersModule,
    MembershipRegisterModule,
    UsersModule,
    MembershipModule,
    NewsModule,
    ExecutiveBodiesModule,
    LocationsModule,
    TemplesModule,
    TempleEventsModule,
    SatramsModule,
    AuthModule,
  ],
})
export class AppModule {}