import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { createHash, randomBytes } from 'crypto';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { MembershipRegister } from '../membership-register/entities/membership-register.entity';
import { MatrimonialUser } from '../matrimonial-users/entities/matrimonial-user.entity';
import { PasswordResetToken } from './password-reset-token.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MembershipRegister)
    private readonly memberRepository: Repository<MembershipRegister>,

    @InjectRepository(MatrimonialUser)
    private readonly matrimonialRepository: Repository<MatrimonialUser>,

    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,

    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async requestPasswordReset(email: string) {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new BadRequestException('Email is required');
    }

    const genericResponse = {
      message:
        'If an account exists for this email, password reset instructions will be sent.',
    };

    const member = await this.memberRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (!member) return genericResponse;

    const matrimonialProfile = await this.matrimonialRepository.findOne({
      where: { member_id: member.member_id },
    });
    const accountType = matrimonialProfile ? 'matrimonial' : 'member';
    const resetToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(resetToken).digest('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

    await this.passwordResetTokenRepository.update(
      { member_id: member.member_id, used_at: IsNull() },
      { used_at: now },
    );
    await this.passwordResetTokenRepository.save(
      this.passwordResetTokenRepository.create({
        token_hash: tokenHash,
        member_id: member.member_id,
        account_type: accountType,
        expires_at: expiresAt,
        used_at: null,
      }),
    );

    const frontendUrl =
      process.env.FRONTEND_URL || 'https://www.aaryavysyamahasabha.com';
    const resetUrl = new URL('/reset-password', frontendUrl);
    resetUrl.searchParams.set('token', resetToken);

    const emailSent = await this.emailService.sendPasswordResetEmail({
      email: member.email,
      name: member.full_name || 'Member',
      resetUrl: resetUrl.toString(),
    });

    if (!emailSent) {
      await this.passwordResetTokenRepository.update(
        { token_hash: tokenHash, used_at: IsNull() },
        { used_at: new Date() },
      );
      return genericResponse;
    }

    return genericResponse;
  }

  async resetPassword(token: string, password: string) {
    if (!token || !password) {
      throw new BadRequestException('Reset token and new password are required');
    }
    if (password.length < 6) {
      throw new BadRequestException(
        'Password must contain at least 6 characters',
      );
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const now = new Date();
    const hashedPassword = await bcrypt.hash(password, 12);

    await this.passwordResetTokenRepository.manager.transaction(
      async (manager) => {
        const resetTokenRepository = manager.getRepository(PasswordResetToken);
        const resetRecord = await resetTokenRepository.findOne({
          where: { token_hash: tokenHash, used_at: IsNull() },
          lock: { mode: 'pessimistic_write' },
        });

        if (!resetRecord || resetRecord.expires_at.getTime() <= now.getTime()) {
          throw new BadRequestException(
            'The password reset link is invalid or expired. Request a new link.',
          );
        }

        if (resetRecord.account_type === 'matrimonial') {
          const profileRepository = manager.getRepository(MatrimonialUser);
          const profile = await profileRepository.findOne({
            where: { member_id: resetRecord.member_id },
          });
          if (!profile) {
            throw new BadRequestException(
              'The account for this reset link could not be found.',
            );
          }
          profile.password = hashedPassword;
          await profileRepository.save(profile);
        } else {
          const memberRepository = manager.getRepository(MembershipRegister);
          const member = await memberRepository.findOne({
            where: { member_id: resetRecord.member_id },
          });
          if (!member) {
            throw new BadRequestException(
              'The account for this reset link could not be found.',
            );
          }
          member.password = hashedPassword;
          await memberRepository.save(member);
        }

        resetRecord.used_at = now;
        await resetTokenRepository.save(resetRecord);
      },
    );

    return { message: 'Password updated successfully. You can now log in.' };
  }

  // =========================================================
  // LOGIN
  // =========================================================

  async login(login: string, password: string) {
    if (!login || !password) {
      throw new BadRequestException('Email/Mobile and password are required');
    }

    const normalizedLogin = login.trim();

    // Login can be done using email OR mobile.
    const member = await this.memberRepository.findOne({
      where: [
        { email: normalizedLogin.toLowerCase() },
        { mobile: normalizedLogin },
      ],
    });

    if (!member) {
      throw new UnauthorizedException('Invalid email/mobile or password');
    }

    const matrimonialProfile = await this.matrimonialRepository.findOne({
      where: {
        member_id: member.member_id,
      },
    });

    if (matrimonialProfile?.password) {
      const matrimonialPasswordValid = await bcrypt.compare(
        password,
        matrimonialProfile.password,
      );

      if (matrimonialPasswordValid) {
        if (
          String(matrimonialProfile.status).trim().toLowerCase() !== 'approved'
        ) {
          throw new ForbiddenException(
            'Your matrimonial profile is awaiting administrator approval. We will email you when it is approved.',
          );
        }

        const access_token = await this.jwtService.signAsync({
          sub: member.id,
          id: member.id,
          member_id: member.member_id,
          email: member.email,
          role: 'user',
          account_type: 'matrimonial',
          matrimonial_id: matrimonialProfile.id,
          gender: member.gender,
          district: member.district,
          mandal: member.mandal,
          sangham: member.sangham,
        });

        const { password: _password, ...safeProfile } = matrimonialProfile;

        return {
          message: 'Login successful',
          access_token,
          token_type: 'Bearer',
          expires_in: '1d',
          user: {
            id: member.id,
            member_id: member.member_id,
            full_name: member.full_name,
            email: member.email,
            mobile: member.mobile,
            role: 'user',
            account_type: 'matrimonial',
            matrimonial_id: matrimonialProfile.id,
            gender: member.gender,
            matrimonial_status: matrimonialProfile.status,
            district: member.district,
            mandal: member.mandal,
            sangham: member.sangham,
            photo: member.photo,
            matrimonial_profile: safeProfile,
          },
        };
      }
    }

    // Member does not have password yet
    if (!member.password) {
      throw new UnauthorizedException(
        'Password has not been created for this account. Please contact administrator.',
      );
    }

    // Compare password with bcrypt hash
    const passwordValid = await bcrypt.compare(password, member.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email/mobile or password');
    }

    // =======================================================
    // JWT PAYLOAD
    // =======================================================

    const payload = {
      sub: member.id,

      id: member.id,

      member_id: member.member_id,

      email: member.email,

      role: member.role || 'user',

      gender: member.gender,

      district: member.district,

      mandal: member.mandal,

      sangham: member.sangham,
    };

    const access_token = await this.jwtService.signAsync(payload);

    // Never return password
    return {
      message: 'Login successful',

      access_token,

      token_type: 'Bearer',

      expires_in: '1d',

      user: {
        id: member.id,

        member_id: member.member_id,

        full_name: member.full_name,

        email: member.email,

        mobile: member.mobile,

        gender: member.gender,

        role: member.role || 'user',

        district: member.district,

        mandal: member.mandal,

        sangham: member.sangham,

        photo: member.photo,

        account_type: 'member',
      },
    };
  }

  // =========================================================
  // CREATE / UPDATE MEMBER PASSWORD
  // SUPER ADMIN USES THIS
  // =========================================================

  async createPassword(memberId: number, password: string) {
    if (!password || password.length < 6) {
      throw new BadRequestException(
        'Password must contain at least 6 characters',
      );
    }

    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    member.password = hashedPassword;

    await this.memberRepository.save(member);

    return {
      message: 'Password created successfully',
      member_id: member.member_id,
    };
  }

  // =========================================================
  // FIRST SUPER ADMIN PASSWORD BOOTSTRAP
  // TEMPORARY
  // =========================================================

  async bootstrapPassword(memberId: number, password: string) {
    if (!password || password.length < 6) {
      throw new BadRequestException(
        'Password must contain at least 6 characters',
      );
    }

    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Only allow this for super_admin
    if (member.role !== 'super_admin') {
      throw new UnauthorizedException(
        'Only Super Admin account can use bootstrap password setup',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    member.password = hashedPassword;

    await this.memberRepository.save(member);

    return {
      message: 'Super Admin password created successfully',
      member_id: member.member_id,
      role: member.role,
    };
  }
  // =========================================================
  // CHANGE MEMBER ROLE
  // SUPER ADMIN USES THIS
  // =========================================================

  async updateRole(memberId: number, role: string) {
    const allowedRoles = [
      'super_admin',
      'state_admin',
      'district_admin',
      'mandal_admin',
      'sangam_admin',
      'user',
    ];

    if (!allowedRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    member.role = role;

    await this.memberRepository.save(member);

    return {
      message: 'Role updated successfully',

      member: {
        id: member.id,

        member_id: member.member_id,

        full_name: member.full_name,

        role: member.role,

        district: member.district,

        mandal: member.mandal,

        sangham: member.sangham,
      },
    };
  }

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  async getProfile(
    userId: number,
    accountType = 'member',
    matrimonialId?: number,
  ) {
    const member = await this.memberRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!member) {
      throw new UnauthorizedException('User not found');
    }

    const profile = {
      id: member.id,

      member_id: member.member_id,

      full_name: member.full_name,

      email: member.email,

      mobile: member.mobile,

      gender: member.gender,

      role: member.role || 'user',

      district: member.district,

      mandal: member.mandal,

      sangham: member.sangham,

      photo: member.photo,
    };

    if (accountType !== 'matrimonial' || !matrimonialId) {
      return {
        ...profile,
        account_type: 'member',
      };
    }

    const matrimonialProfile = await this.matrimonialRepository.findOne({
      where: {
        id: matrimonialId,
        member_id: member.member_id,
      },
    });

    if (!matrimonialProfile) {
      throw new UnauthorizedException('Matrimonial profile not found');
    }

    const { password: _password, ...safeMatrimonialProfile } =
      matrimonialProfile;

    return {
      ...profile,
      account_type: 'matrimonial',
      matrimonial_id: matrimonialProfile.id,
      matrimonial_profile: safeMatrimonialProfile,
    };
  }

  // =========================================================
  // CHANGE OWN PASSWORD
  // LOGGED-IN USER
  // =========================================================

  async changeMyPassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
    accountType = 'member',
    matrimonialId?: number,
  ) {
    if (!currentPassword || !newPassword) {
      throw new BadRequestException(
        'Current password and new password are required',
      );
    }

    if (newPassword.length < 6) {
      throw new BadRequestException(
        'New password must contain at least 6 characters',
      );
    }

    const account =
      accountType === 'matrimonial' && matrimonialId
        ? await this.matrimonialRepository.findOne({
            where: {
              id: matrimonialId,
            },
          })
        : await this.memberRepository.findOne({
            where: {
              id: userId,
            },
          });

    if (!account) {
      throw new NotFoundException('User not found');
    }

    if (!account.password) {
      throw new BadRequestException(
        'Password has not been created for this account',
      );
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(
      currentPassword,
      account.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Prevent using same password
    const samePassword = await bcrypt.compare(newPassword, account.password);

    if (samePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    if (accountType === 'matrimonial' && matrimonialId) {
      await this.matrimonialRepository.update(
        { id: matrimonialId },
        { password: hashedPassword },
      );
    } else {
      await this.memberRepository.update(
        { id: userId },
        { password: hashedPassword },
      );
    }

    return {
      message: 'Password updated successfully',
    };
  }
}
