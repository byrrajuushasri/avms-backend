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
  // POST /membership-register
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
        where: { email },
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
        where: { mobile },
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

  member.full_name =
    dto.full_name?.trim();

  member.mobile =
    mobile;

  member.email =
    email;

  member.occupation =
    dto.occupation?.trim();

  member.gender =
    dto.gender?.trim();

  member.date_of_birth =
    dto.date_of_birth;

  // =======================================================
  // IMPORTANT
  // RAILWAY member_id IS NOT NULL
  // So give temporary ID for FIRST INSERT
  // =======================================================

  member.member_id =
    `TEMP_${Date.now()}`;

  // =======================================================
  // DEFAULT ROLE
  // =======================================================

  member.role = 'user';

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
  // STATUS
  // =======================================================

  member.status =
    'Active';

  // =======================================================
  // MAHASHABA PAYMENT
  // =======================================================

  member.mahashaba_payment_status =
    dto.mahashaba_payment_status;

  member.mahashaba_payment_method =
    dto.mahashaba_payment_method?.trim() || null;

  member.mahashaba_receipt_number =
    dto.mahashaba_receipt_number?.trim() || null;

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
    dto.sangam_payment_method?.trim() || null;

  member.sangam_receipt_number =
    dto.sangam_receipt_number?.trim() || null;

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
      await this.membershipRepository.save(member);
  } catch (error: any) {
    console.error(
      'MEMBERSHIP CREATE ERROR:',
      error,
    );

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
  // GENERATE REAL MEMBER ID
  // =======================================================

  const memberId =
    `TVM${String(savedMember.id).padStart(5, '0')}`;

  // =======================================================
  // UPDATE MEMBER ID
  // =======================================================

  savedMember.member_id =
    memberId;

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

    id:
      updatedMember.id,

    photo:
      updatedMember.photo,

    data:
      updatedMember,
  };
}
  // =========================================================
  // PUBLIC EXECUTIVE MEMBERS
  // GET /membership-register/public/executives
  //
  // NO JWT REQUIRED
  // Used by public Contact page
  // =========================================================


// =========================================================
// PUBLIC EXECUTIVE MEMBERS
// GET /membership-register/public/executives
// =========================================================

async findPublicExecutives() {
  const members =
    await this.membershipRepository.find({
      order: {
        created_at: 'DESC',
      },
    });

  return members.filter((member) => {
    // =======================================================
    // EXECUTIVE BODY
    // =======================================================

    const body = String(
      member.executive_body ?? '',
    )
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ');

    const isBody =
      body === 'state' ||
      body === 'state body' ||
      body.startsWith('state ') ||

      body === 'district' ||
      body === 'district body' ||
      body.startsWith('district ') ||

      body === 'mandal' ||
      body === 'mandal body' ||
      body.startsWith('mandal ') ||

      body === 'sangam' ||
      body === 'sangam body' ||
      body.startsWith('sangam ');

    if (!isBody) {
      return false;
    }

    // =======================================================
    // DESIGNATION
    // =======================================================

    const designation = String(
      member.designation ?? '',
    )
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ');

    const isDesignation =
      designation === 'president' ||
      designation === 'vice president' ||
      designation === 'general secretary' ||
      designation === 'joint secretary';

    if (!isDesignation) {
      return false;
    }
  return true;
  });
}

 // =========================================================
  // GET ALL MEMBERS - ADMIN
  // GET /membership-register
  // =========================================================

  async findAll(
    sangham?: string,
    role?: string,
  ) {
    console.log(
      'SERVICE ROLE:',
      role,
    );

    console.log(
      'SERVICE SANGHAM:',
      sangham,
    );

    // =======================================================
    // SUPER ADMIN
    // =======================================================

    if (
      role &&
      role.trim().toLowerCase() ===
        'super_admin'
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

    // =======================================================
    // SANGHAM ADMIN
    // =======================================================

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
          sangham:
            sangham.trim(),
        },

        order: {
          created_at: 'DESC',
        },
      });
    }

    // =======================================================
    // OTHER ROLES
    // =======================================================

    return [];
  }

  // =========================================================
// UPDATE MEMBER
// PUT /membership-register/:id
// =========================================================

// =========================================================
// UPDATE MEMBER
// PUT /membership-register/:id
// =========================================================

async update(
  id: number,
  dto: UpdateMembershipRegisterDto,
  photoPath?: string,
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

  // =======================================================
  // BASIC DETAILS
  // =======================================================

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

  if (dto.occupation !== undefined) {
    member.occupation =
      dto.occupation.trim();
  }

  if (dto.gender !== undefined) {
    member.gender =
      dto.gender.trim();
  }

  if (dto.date_of_birth !== undefined) {
    const dob =
      String(dto.date_of_birth).trim();

    if (dob !== '') {
      member.date_of_birth = dob;
    }
  }

  // =======================================================
  // ROLE
  // =======================================================

  if (dto.role !== undefined) {
    member.role =
      dto.role.trim();
  }

  // =======================================================
  // STATUS
  // =======================================================

  if (dto.status !== undefined) {
    member.status =
      dto.status.trim();
  }

  // =======================================================
  // PASSWORD
  // =======================================================

  if (
    dto.password !== undefined &&
    dto.password.trim() !== ''
  ) {
    member.password =
      await bcrypt.hash(
        dto.password.trim(),
        10,
      );
  }

  // =======================================================
  // EXECUTIVE DETAILS
  // =======================================================

  if (dto.executive_body !== undefined) {
    const executiveBody =
      dto.executive_body.trim();

    if (executiveBody !== '') {
      member.executive_body =
        executiveBody;
    }
  }

  if (dto.designation !== undefined) {
    const designation =
      dto.designation.trim();

    if (designation !== '') {
      member.designation =
        designation;
    }
  }

  // =======================================================
  // LOCATION
  // =======================================================

  if (dto.district !== undefined) {
    member.district =
      dto.district.trim() || null;
  }

  if (dto.mandal !== undefined) {
    member.mandal =
      dto.mandal.trim() || null;
  }

  if (dto.sangham !== undefined) {
    member.sangham =
      dto.sangham.trim() || null;
  }

  // =======================================================
  // PHOTO
  // =======================================================

  if (photoPath) {
    member.photo =
      photoPath;
  }

  // =======================================================
  // MAHASHABA PAYMENT
  // =======================================================

  if (
    dto.mahashaba_payment_status !==
    undefined
  ) {
    member.mahashaba_payment_status =
      dto.mahashaba_payment_status.trim();
  }

  if (
    dto.mahashaba_payment_method !==
    undefined
  ) {
    member.mahashaba_payment_method =
      dto.mahashaba_payment_method.trim() ||
      null;
  }

  if (
    dto.mahashaba_receipt_number !==
    undefined
  ) {
    member.mahashaba_receipt_number =
      dto.mahashaba_receipt_number.trim() ||
      null;
  }

  if (
    dto.mahashaba_amount_paid !==
    undefined
  ) {
    const amount =
      String(
        dto.mahashaba_amount_paid,
      ).trim();

    member.mahashaba_amount_paid =
      amount !== ''
        ? Number(amount)
        : null;
  }

  if (
    dto.mahashaba_payment_date !==
    undefined
  ) {
    const paymentDate =
      String(
        dto.mahashaba_payment_date,
      ).trim();

    member.mahashaba_payment_date =
      paymentDate !== ''
        ? paymentDate
        : null;
  }

  // =======================================================
  // SANGAM PAYMENT
  // =======================================================

  if (
    dto.sangam_payment_status !==
    undefined
  ) {
    member.sangam_payment_status =
      dto.sangam_payment_status.trim();
  }

  if (
    dto.sangam_payment_method !==
    undefined
  ) {
    member.sangam_payment_method =
      dto.sangam_payment_method.trim() ||
      null;
  }

  if (
    dto.sangam_receipt_number !==
    undefined
  ) {
    member.sangam_receipt_number =
      dto.sangam_receipt_number.trim() ||
      null;
  }

  if (
    dto.sangam_amount_paid !==
    undefined
  ) {
    const amount =
      String(
        dto.sangam_amount_paid,
      ).trim();

    member.sangam_amount_paid =
      amount !== ''
        ? Number(amount)
        : null;
  }

  if (
    dto.sangam_payment_date !==
    undefined
  ) {
    const paymentDate =
      String(
        dto.sangam_payment_date,
      ).trim();

    member.sangam_payment_date =
      paymentDate !== ''
        ? paymentDate
        : null;
  }

  // =======================================================
  // SAVE
  // =======================================================

  try {
    const updated =
      await this.membershipRepository.save(
        member,
      );

    // =====================================================
    // NEVER RETURN PASSWORD
    // =====================================================

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
  } catch (error: any) {
    console.error(
      'MEMBERSHIP UPDATE ERROR:',
      error,
    );

    if (
      error?.code === 'ER_DUP_ENTRY'
    ) {
      const message =
        String(
          error?.sqlMessage ||
          error?.message ||
          '',
        ).toLowerCase();

      if (
        message.includes('email')
      ) {
        throw new ConflictException(
          'This email address is already registered.',
        );
      }

      if (
        message.includes('mobile')
      ) {
        throw new ConflictException(
          'This mobile number is already registered.',
        );
      }

      throw new ConflictException(
        'Duplicate member information.',
      );
    }

    throw error;
  }
}



async remove(id: number) {
  const member =
    await this.membershipRepository.findOne({
      where: { id },
    });

  if (!member) {
    throw new NotFoundException(
      `Member with ID ${id} not found`,
    );
  }

  await this.membershipRepository.remove(member);

  return {
    message: 'Member deleted successfully',
    id,
  };
}
  // =========================================================
  // GET ONE MEMBER
  // GET /membership-register/:id
  // =========================================================

  async findOne(id: number) {
    return this.membershipRepository.findOne({
      where: {
        id,
      },
    });
  }
}

