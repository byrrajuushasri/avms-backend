import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Membership } from './entity/membership.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
  ) {}

  // ============================================
  // CREATE MEMBERSHIP
  // ============================================

  async create(createMembershipDto: CreateMembershipDto) {
    const { member_id } = createMembershipDto;

    // --------------------------------------------
    // 1. Check duplicate member
    // --------------------------------------------

    const existingMembership =
      await this.membershipRepository.findOne({
        where: {
          member_id: member_id,
        },
      });

    if (existingMembership) {
      throw new BadRequestException(
        `Membership already exists for ${member_id}`,
      );
    }

    // --------------------------------------------
    // 2. Get latest membership
    // --------------------------------------------

    const memberships =
      await this.membershipRepository.find({
        order: {
          id: 'DESC',
        },
        take: 1,
      });

    // --------------------------------------------
    // 3. Generate next number
    // --------------------------------------------

    const nextNumber =
      memberships.length > 0
        ? memberships[0].id + 1
        : 1;

    // --------------------------------------------
    // 4. Generate MEM00001
    // --------------------------------------------

    const membershipMemberId =
      `MEM${String(nextNumber).padStart(5, '0')}`;

    console.log(
      'Generated Membership ID:',
      membershipMemberId,
    );

    // --------------------------------------------
    // 5. Create record
    // --------------------------------------------

    const membership =
      this.membershipRepository.create({
        member_id: member_id,
        membership_member_id: membershipMemberId,
      });

    console.log(
      'Before Save:',
      membership,
    );

    // --------------------------------------------
    // 6. Save
    // --------------------------------------------

    const savedMembership =
      await this.membershipRepository.save(
        membership,
      );

    console.log(
      'After Save:',
      savedMembership,
    );

    return savedMembership;
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
          id: id,
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
          member_id: member_id,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        `Membership not found for ${member_id}`,
      );
    }

    return membership;
  }
}