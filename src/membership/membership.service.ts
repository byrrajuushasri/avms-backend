
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Membership } from './entity/membership.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { Member } from '../members/entity/member.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // ============================================
  // CREATE MEMBERSHIP
  // ============================================

  async create(createMembershipDto: CreateMembershipDto) {
    const { member_id } = createMembershipDto;

    const existingMembership =
      await this.membershipRepository.findOne({
        where: {
          member_id,
        },
      });

    if (existingMembership) {
      throw new BadRequestException(
        `Membership already exists for ${member_id}`,
      );
    }

    const memberships =
      await this.membershipRepository.find({
        order: {
          id: 'DESC',
        },
        take: 1,
      });

    const nextNumber =
      memberships.length > 0
        ? memberships[0].id + 1
        : 1;

    const membershipMemberId =
      `MEM${String(nextNumber).padStart(5, '0')}`;

    const membership =
      this.membershipRepository.create({
        member_id,
        membership_member_id: membershipMemberId,
      });

    return this.membershipRepository.save(
      membership,
    );
  }

  // ============================================
  // GET ALL MEMBERSHIPS
  // ============================================

  async findAll() {
    return this.membershipRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  // ============================================
  // GET MEMBERSHIP BY ID
  // ============================================

  async findOne(id: number) {
    const membership =
      await this.membershipRepository.findOne({
        where: {
          id,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        `Membership ID ${id} not found`,
      );
    }

    return membership;
  }

  // ============================================
  // GET MEMBERSHIP BY MEMBER ID
  // ============================================

  async findByMemberId(member_id: string) {
    const membership =
      await this.membershipRepository.findOne({
        where: {
          member_id,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        `Membership not found for ${member_id}`,
      );
    }

    return membership;
  }

  // ============================================
  // UPDATE ADMIN PROFILE
  //
  // PATCH /membership/member/:id
  // ============================================

  async updateMemberProfile(
    id: number,
    data: {
      full_name: string;
      email: string;
      mobile: string;
    },
  ) {
    // Find member from MEMBERS table
    const member =
      await this.memberRepository.findOne({
        where: {
          id,
        },
      });

    if (!member) {
      throw new NotFoundException(
        'Member not found',
      );
    }

    // ==========================================
    // VALIDATE FULL NAME
    // ==========================================

    const fullName = data.full_name?.trim();

    if (!fullName) {
      throw new BadRequestException(
        'Full name is required',
      );
    }

    // ==========================================
    // VALIDATE EMAIL
    // ==========================================

    const email = data.email?.trim();

    if (!email) {
      throw new BadRequestException(
        'Email is required',
      );
    }

    // ==========================================
    // VALIDATE MOBILE
    // ==========================================

    const mobile = data.mobile?.trim();

    if (!mobile) {
      throw new BadRequestException(
        'Mobile number is required',
      );
    }

    // ==========================================
    // EMAIL DUPLICATE CHECK
    // ==========================================

    const existingEmail =
      await this.memberRepository.findOne({
        where: {
          email,
        },
      });

    if (
      existingEmail &&
      existingEmail.id !== id
    ) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    // ==========================================
    // MOBILE DUPLICATE CHECK
    // ==========================================

    const existingMobile =
      await this.memberRepository.findOne({
        where: {
          mobile,
        },
      });

    if (
      existingMobile &&
      existingMobile.id !== id
    ) {
      throw new ConflictException(
        'Mobile number already exists',
      );
    }

    // ==========================================
    // UPDATE ONLY PROFILE FIELDS
    // ==========================================

    member.full_name = fullName;
    member.email = email;
    member.mobile = mobile;

    // IMPORTANT:
    // role
    // password
    // status
    // member_id
    // photo
    // designation
    // etc.
    // will NOT be changed.

    const updatedMember =
      await this.memberRepository.save(member);

    // ==========================================
    // RESPONSE
    // ==========================================

    return {
      message:
        'Admin profile updated successfully.',

      user: {
        id: updatedMember.id,
        member_id: updatedMember.member_id,
        full_name: updatedMember.full_name,
        email: updatedMember.email,
        mobile: updatedMember.mobile,
      },
    };
  }
}

