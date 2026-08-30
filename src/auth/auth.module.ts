import { Module } from "@nestjs/common";

import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";

import {
  JwtModule,
} from "@nestjs/jwt";

import {
  PassportModule,
} from "@nestjs/passport";

import {
  TypeOrmModule,
} from "@nestjs/typeorm";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

import { MembershipRegister } from
  "../membership-register/entities/membership-register.entity";

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([
      MembershipRegister,
    ]),

    PassportModule.register({
      defaultStrategy: "jwt",
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        secret:
          configService.get<string>(
            "JWT_SECRET",
          ),

        signOptions: {
          expiresIn: "1d",
        },
      }),
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}