import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { MembershipRegister } from "../membership-register/entities/membership-register.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MembershipRegister)
    private readonly memberRepository: Repository<MembershipRegister>,

    private readonly jwtService: JwtService,
  ) {}

  // =========================================================
  // LOGIN
  // =========================================================

  async login(
    login: string,
    password: string,
  ) {
    if (!login || !password) {
      throw new BadRequestException(
        "Email/Mobile and password are required",
      );
    }

    // Login can be done using email OR mobile
    const member = await this.memberRepository.findOne({
      where: [
        { email: login },
        { mobile: login },
      ],
    });

    if (!member) {
      throw new UnauthorizedException(
        "Invalid email/mobile or password",
      );
    }

    // Member does not have password yet
    if (!member.password) {
      throw new UnauthorizedException(
        "Password has not been created for this account. Please contact administrator.",
      );
    }

    // Compare password with bcrypt hash
    const passwordValid = await bcrypt.compare(
      password,
      member.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        "Invalid email/mobile or password",
      );
    }

    // =======================================================
    // JWT PAYLOAD
    // =======================================================

    const payload = {
      sub: member.id,

      id: member.id,

      member_id: member.member_id,

      email: member.email,

      role: member.role || "user",

      district: member.district,

      mandal: member.mandal,

      sangham: member.sangham,
    };

    const access_token =
      await this.jwtService.signAsync(payload);

    // Never return password
    return {
      message: "Login successful",

      access_token,

      token_type: "Bearer",

      expires_in: "1d",

      user: {
        id: member.id,

        member_id: member.member_id,

        full_name: member.full_name,

        email: member.email,

        mobile: member.mobile,

        role: member.role || "user",

        district: member.district,

        mandal: member.mandal,

        sangham: member.sangham,

        photo: member.photo,
      },
    };
  }

  // =========================================================
  // CREATE / UPDATE MEMBER PASSWORD
  // SUPER ADMIN USES THIS
  // =========================================================

  async createPassword(
    memberId: number,
    password: string,
  ) {
    if (!password || password.length < 6) {
      throw new BadRequestException(
        "Password must contain at least 6 characters",
      );
    }

    const member =
      await this.memberRepository.findOne({
        where: {
          id: memberId,
        },
      });

    if (!member) {
      throw new NotFoundException(
        "Member not found",
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    member.password = hashedPassword;

    await this.memberRepository.save(member);

    return {
      message:
        "Password created successfully",
      member_id: member.member_id,
    };
  }




  // =========================================================
// FIRST SUPER ADMIN PASSWORD BOOTSTRAP
// TEMPORARY
// =========================================================

async bootstrapPassword(
  memberId: number,
  password: string,
) {
  if (!password || password.length < 6) {
    throw new BadRequestException(
      "Password must contain at least 6 characters",
    );
  }

  const member =
    await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

  if (!member) {
    throw new NotFoundException(
      "Member not found",
    );
  }

  // Only allow this for super_admin
  if (member.role !== "super_admin") {
    throw new UnauthorizedException(
      "Only Super Admin account can use bootstrap password setup",
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 12);

  member.password = hashedPassword;

  await this.memberRepository.save(member);

  return {
    message:
      "Super Admin password created successfully",
    member_id: member.member_id,
    role: member.role,
  };
}
  // =========================================================
  // CHANGE MEMBER ROLE
  // SUPER ADMIN USES THIS
  // =========================================================

  async updateRole(
    memberId: number,
    role: string,
  ) {
    const allowedRoles = [
      "super_admin",
      "state_admin",
      "district_admin",
      "mandal_admin",
      "sangam_admin",
      "user",
    ];

    if (!allowedRoles.includes(role)) {
      throw new BadRequestException(
        "Invalid role",
      );
    }

    const member =
      await this.memberRepository.findOne({
        where: {
          id: memberId,
        },
      });

    if (!member) {
      throw new NotFoundException(
        "Member not found",
      );
    }

    member.role = role;

    await this.memberRepository.save(member);

    return {
      message: "Role updated successfully",

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

  async getProfile(userId: number) {
    const member =
      await this.memberRepository.findOne({
        where: {
          id: userId,
        },
      });

    if (!member) {
      throw new UnauthorizedException(
        "User not found",
      );
    }

    return {
      id: member.id,

      member_id: member.member_id,

      full_name: member.full_name,

      email: member.email,

      mobile: member.mobile,

      role: member.role || "user",

      district: member.district,

      mandal: member.mandal,

      sangham: member.sangham,

      photo: member.photo,
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
) {
  if (!currentPassword || !newPassword) {
    throw new BadRequestException(
      "Current password and new password are required",
    );
  }

  if (newPassword.length < 6) {
    throw new BadRequestException(
      "New password must contain at least 6 characters",
    );
  }

  // Find logged-in member
  const member =
    await this.memberRepository.findOne({
      where: {
        id: userId,
      },
    });

  if (!member) {
    throw new NotFoundException(
      "User not found",
    );
  }

  // Check whether password exists
  if (!member.password) {
    throw new BadRequestException(
      "Password has not been created for this account",
    );
  }

  // Verify current password
  const passwordValid =
    await bcrypt.compare(
      currentPassword,
      member.password,
    );

  if (!passwordValid) {
    throw new UnauthorizedException(
      "Current password is incorrect",
    );
  }

  // Prevent using same password
  const samePassword =
    await bcrypt.compare(
      newPassword,
      member.password,
    );

  if (samePassword) {
    throw new BadRequestException(
      "New password must be different from current password",
    );
  }

  // Hash new password
  const hashedPassword =
    await bcrypt.hash(newPassword, 12);

  member.password = hashedPassword;

  await this.memberRepository.save(member);

  return {
    message: "Password updated successfully",
  };
}

}