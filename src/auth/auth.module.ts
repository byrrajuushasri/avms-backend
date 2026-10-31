import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PasswordResetToken } from './password-reset-token.entity';

import { MembershipRegister } from '../membership-register/entities/membership-register.entity';
import { MatrimonialUser } from '../matrimonial-users/entities/matrimonial-user.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([
      MembershipRegister,
      MatrimonialUser,
      PasswordResetToken,
    ]),
    EmailModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
