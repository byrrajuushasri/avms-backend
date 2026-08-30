import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';


import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MembershipRegister } from './entities/membership-register.entity';
import { CreateMembershipRegisterDto } from './dto/create-membership-register.dto';
import { UpdateMembershipRegisterDto } from './dto/update-membership-register.dto';

@Injectable()
export class MembershipRegisterService {
  constructor(
    @InjectRepository(MembershipRegister)
    private readonly membershipRepository: Repository<MembershipRegister>,
  ) {}

  // =========================================================
  // CREATE MEMBERSHIP
  // =========================================================

  async create(
    dto: CreateMembershipRegisterDto,
    photoPath?: string,
  ) {
    // =======================================================
    // DUPLICATE EMAIL CHECK
    // =======================================================

    const email = dto.email?.trim().toLowerCase();

    if (email) {
      const existingEmail =
        await this.membershipRepository.findOne({
          where: {
            email,
          },
        });

      if (existingEmail) {
        throw new ConflictException(
          `This email address is already registered. Member ID: ${
            existingEmail.member_id || existingEmail.id
          }`,
        );
      }
    }

    // =======================================================
    // DUPLICATE MOBILE CHECK
    // =======================================================

    const mobile = dto.mobile?.trim();

    if (mobile) {
      const existingMobile =
        await this.membershipRepository.findOne({
          where: {
            mobile,
          },
        });

      if (existingMobile) {
        throw new ConflictException(
          `This mobile number is already registered. Member ID: ${
            existingMobile.member_id || existingMobile.id
          }`,
        );
      }
    }

    // =======================================================
    // CREATE MEMBER
    // =======================================================

    const member = new MembershipRegister();

    member.full_name = dto.full_name?.trim();

    member.mobile = mobile;

    member.email = email;

    member.occupation =
      dto.occupation?.trim();

    member.gender = dto.gender;

    member.date_of_birth =
      dto.date_of_birth;

    // =======================================================
    // LOCATION
    // =======================================================

    member.district =
      dto.district?.trim() || null;

    member.mandal =
      dto.mandal?.trim() || null;

    member.sangham =
      dto.sangham?.trim() || null;

    // =======================================================
    // PHOTO
    // =======================================================

    member.photo =
      photoPath || null;

    // =======================================================
    // MAHASHABA PAYMENT
    // =======================================================

    member.mahashaba_payment_status =
      dto.mahashaba_payment_status;

    member.mahashaba_payment_method =
      dto.mahashaba_payment_method?.trim() ||
      null;

    member.mahashaba_receipt_number =
      dto.mahashaba_receipt_number?.trim() ||
      null;

    member.mahashaba_amount_paid =
      dto.mahashaba_amount_paid
        ? Number(dto.mahashaba_amount_paid)
        : null;

    member.mahashaba_payment_date =
      dto.mahashaba_payment_date || null;

    // =======================================================
    // SANGAM PAYMENT
    // =======================================================

    member.sangam_payment_status =
      dto.sangam_payment_status;

    member.sangam_payment_method =
      dto.sangam_payment_method?.trim() ||
      null;

    member.sangam_receipt_number =
      dto.sangam_receipt_number?.trim() ||
      null;

    member.sangam_amount_paid =
      dto.sangam_amount_paid
        ? Number(dto.sangam_amount_paid)
        : null;

    member.sangam_payment_date =
      dto.sangam_payment_date || null;

    // =======================================================
    // EXECUTIVE DETAILS
    // =======================================================

    member.executive_body =
      dto.executive_body?.trim() ||
      'State Body';

    member.designation =
      dto.designation?.trim() ||
      'Member';

    // =======================================================
    // FIRST SAVE
    // =======================================================

    let savedMember: MembershipRegister;

    try {
      savedMember =
        await this.membershipRepository.save(
          member,
        );
    } catch (error: any) {
      // =====================================================
      // MYSQL DUPLICATE ENTRY
      // =====================================================

      if (error?.code === 'ER_DUP_ENTRY') {
        const message = String(
          error?.sqlMessage ||
            error?.message ||
            '',
        ).toLowerCase();

        if (message.includes('email')) {
          throw new ConflictException(
            'This email address is already registered.',
          );
        }

        if (message.includes('mobile')) {
          throw new ConflictException(
            'This mobile number is already registered.',
          );
        }

        throw new ConflictException(
          'This member already exists.',
        );
      }

      throw error;
    }

    // =======================================================
    // GENERATE TVM MEMBER ID
    // =======================================================

    const memberId = `TVM${String(
      savedMember.id,
    ).padStart(5, '0')}`;

    savedMember.member_id =
      memberId;

    // =======================================================
    // SECOND SAVE
    // =======================================================

    const updatedMember =
      await this.membershipRepository.save(
        savedMember,
      );

    // =======================================================
    // RESPONSE
    // =======================================================

    return {
      success: true,

      message:
        'Membership registered successfully',

      member_id:
        updatedMember.member_id,

      id: updatedMember.id,

      photo:
        updatedMember.photo,

      data:
        updatedMember,
    };
  }

  // =========================================================
  // GET ALL MEMBERS
  // =========================================================



async findAll(
  sangham?: string,
  role?: string,
) {
  console.log('SERVICE ROLE:', role);
  console.log('SERVICE SANGHAM:', sangham);

  // =========================================================
  // SUPER ADMIN
  // =========================================================

  if (
    role &&
    role.trim().toLowerCase() === 'super_admin'
  ) {
    console.log(
      'SUPER ADMIN → SHOWING ALL MEMBERS',
    );

    const members =
      await this.membershipRepository.find({
        order: {
          created_at: 'DESC',
        },
      });

    console.log(
      'TOTAL MEMBERS:',
      members.length,
    );

    return members;
  }

  // =========================================================
  // SANGHAM ADMIN
  // =========================================================

  if (
    role?.trim().toLowerCase() ===
      'sangham_admin' ||
    role?.trim().toLowerCase() ===
      'sangam_admin'
  ) {
    if (!sangham?.trim()) {
      return [];
    }

    return this.membershipRepository.find({
      where: {
        sangham: sangham.trim(),
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  // =========================================================
  // OTHER ROLES
  // =========================================================

  return [];
}



async update(
  id: number,
  dto: UpdateMembershipRegisterDto,
) {
  const member =
    await this.membershipRepository.findOne({
      where: { id },
    });

  if (!member) {
    throw new NotFoundException(
      `Member with ID ${id} not found`,
    );
  }

  // =========================================================
  // BASIC DETAILS
  // =========================================================

  if (dto.full_name !== undefined) {
    member.full_name =
      dto.full_name.trim();
  }

  if (dto.mobile !== undefined) {
    member.mobile =
      dto.mobile.trim();
  }

  if (dto.email !== undefined) {
    member.email =
      dto.email.trim().toLowerCase();
  }

  if (dto.gender !== undefined) {
    member.gender =
      dto.gender.trim();
  }

  // =========================================================
  // ROLE
  // =========================================================

  if (dto.role !== undefined) {
    member.role =
      dto.role.trim();
  }

  // =========================================================
  // PASSWORD
  // Hash ONLY when a new password is entered
  // =========================================================

  if (
    dto.password !== undefined &&
    dto.password.trim() !== ''
  ) {
    const saltRounds = 10;

    member.password =
      await bcrypt.hash(
        dto.password.trim(),
        saltRounds,
      );
  }

  // =========================================================
  // SAVE
  // =========================================================

  const updated =
    await this.membershipRepository.save(
      member,
    );

  // =========================================================
  // RESPONSE
  // Never return password
  // =========================================================

  const {
    password,
    ...safeMember
  } = updated;

  return {
    success: true,
    message:
      'Member updated successfully',
    data: safeMember,
  };
}


  // =========================================================
  // GET ONE MEMBER
  // =========================================================

  async findOne(id: number) {
    return this.membershipRepository.findOne({
      where: {
        id,
      },
    });
  }
}