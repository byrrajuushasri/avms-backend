import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { MatrimonialUser } from './entities/matrimonial-user.entity';

import { MembershipRegister } from '../membership-register/entities/membership-register.entity';

import { EmailService } from '../email/email.service';

@Injectable()
export class MatrimonialUsersService {
  constructor(
    @InjectRepository(MatrimonialUser)
    private readonly userRepository: Repository<MatrimonialUser>,

    @InjectRepository(MembershipRegister)
    private readonly memberRepository: Repository<MembershipRegister>,

    private readonly emailService: EmailService,
  ) {}

  // =========================================================
  // CHECK MEMBER
  // =========================================================

  async checkMember(
    data: { mobile?: string | number | null } | null | undefined,
  ) {
    const mobile = data?.mobile != null ? String(data.mobile).trim() : '';

    if (!mobile) {
      return {
        success: false,
        canRegister: false,
        message: 'Please enter a valid Mobile Number.',
      };
    }

    // Find membership using mobile number
    const member = await this.memberRepository.findOne({
      where: { mobile },
    });

    if (!member) {
      return {
        success: false,
        canRegister: false,
        message:
          'Please register as a member first. Then you can register for Matrimonial.',
      };
    }

    // Prevent duplicate matrimonial registration
    const existingProfile = await this.userRepository.findOne({
      where: { member_id: member.member_id },
    });

    if (existingProfile) {
      return {
        success: false,
        canRegister: false,
        message: 'You have already registered for Matrimonial.',
      };
    }

    return {
      success: true,
      canRegister: true,
      message:
        'Membership verified successfully. You can register for Matrimonial.',
      data: {
        full_name: member.full_name ?? null,
        name: member.full_name ?? null,
        mobile: member.mobile ?? null,
        email: member.email ?? null,
        gender: member.gender ?? null,
        occupation: member.occupation ?? null,
        date_of_birth: member.date_of_birth ?? null,
        photo: member.photo ?? null,
        district: member.district ?? null,
        mandal: member.mandal ?? null,
        sangham: member.sangham ?? null,
      },
    };
  }

  // =========================================================
  // DELETE
  // =========================================================

  async remove(id: number) {
    const member = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!member) {
      throw new NotFoundException(`Matrimonial member with ID ${id} not found`);
    }

    await this.userRepository.remove(member);

    return {
      message: 'Matrimonial profile deleted successfully',

      id,
    };
  }
}
