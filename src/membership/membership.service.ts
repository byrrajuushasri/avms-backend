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

  // ============================================================
  // GENERATE AVS ID
  //
  // Format:
  // AVS + District(2) + Mandal(2) + Sangham(2) + Serial(3)
  //
  // Example:
  // AVS011415001
  // ============================================================

  async generateAvsId(
    districtCode: string,
    mandalCode: string,
    sanghamCode: string,
  ): Promise<string> {
    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!districtCode) {
      throw new BadRequestException(
        'District code is required to generate AVS ID.',
      );
    }

    if (!mandalCode) {
      throw new BadRequestException(
        'Mandal code is required to generate AVS ID.',
      );
    }

    if (!sanghamCode) {
      throw new BadRequestException(
        'Sangham code is required to generate AVS ID.',
      );
    }

    // ----------------------------------------------------------
    // NORMALIZE CODES
    // ----------------------------------------------------------

    const district = String(districtCode)
      .trim()
      .padStart(2, '0');

    const mandal = String(mandalCode)
      .trim()
      .padStart(2, '0');

    const sangham = String(sanghamCode)
      .trim()
      .padStart(2, '0');

    // ----------------------------------------------------------
    // PREFIX
    //
    // Example:
    // AVS011415
    // ----------------------------------------------------------

    const prefix =
      `AVS${district}${mandal}${sangham}`;

    // ----------------------------------------------------------
    // FIND LAST AVS ID FOR SAME LOCATION
    // ----------------------------------------------------------

    const lastMember =
      await this.memberRepository
        .createQueryBuilder('member')
        .where(
          'member.avs_id LIKE :prefix',
          {
            prefix: `${prefix}%`,
          },
        )
        .orderBy(
          'member.avs_id',
          'DESC',
        )
        .getOne();

    // ----------------------------------------------------------
    // FIRST MEMBER
    // ----------------------------------------------------------

    let nextSerial = 1;

    // ----------------------------------------------------------
    // NEXT MEMBER
    // ----------------------------------------------------------

    if (
      lastMember &&
      lastMember.avs_id
    ) {
      const match =
        lastMember.avs_id.match(
          /(\d{3})$/,
        );

      if (match) {
        const lastSerial =
          Number(match[1]);

        if (!isNaN(lastSerial)) {
          nextSerial =
            lastSerial + 1;
        }
      }
    }

    // ----------------------------------------------------------
    // MAX SERIAL CHECK
    // ----------------------------------------------------------

    if (nextSerial > 999) {
      throw new BadRequestException(
        `AVS serial limit reached for ${prefix}`,
      );
    }

    // ----------------------------------------------------------
    // FINAL AVS ID
    //
    // AVS011415001
    // ----------------------------------------------------------

    const avsId =
      `${prefix}${String(nextSerial).padStart(3, '0')}`;

    return avsId;
  }

  // ============================================================
  // CHECK AVS ID EXISTS
  // ============================================================

  async isAvsIdExists(
    avsId: string,
  ): Promise<boolean> {
    const member =
      await this.memberRepository.findOne({
        where: {
          avs_id: avsId,
        },
      });

    return !!member;
  }

  // ============================================================
  // GENERATE UNIQUE AVS ID
  // ============================================================

  async generateUniqueAvsId(
    districtCode: string,
    mandalCode: string,
    sanghamCode: string,
  ): Promise<string> {
    let avsId =
      await this.generateAvsId(
        districtCode,
        mandalCode,
        sanghamCode,
      );

    // ----------------------------------------------------------
    // EXTRA SAFETY CHECK
    // ----------------------------------------------------------

    let exists =
      await this.isAvsIdExists(
        avsId,
      );

    while (exists) {
      const prefix =
        avsId.substring(0, 9);

      const currentSerial =
        Number(
          avsId.substring(9),
        );

      const nextSerial =
        currentSerial + 1;

      if (nextSerial > 999) {
        throw new BadRequestException(
          `AVS serial limit reached for ${prefix}`,
        );
      }

      avsId =
        `${prefix}${String(nextSerial).padStart(3, '0')}`;

      exists =
        await this.isAvsIdExists(
          avsId,
        );
    }

    return avsId;
  }

  // ============================================================
  // CREATE MEMBERSHIP
  // ============================================================

  async create(
    createMembershipDto: CreateMembershipDto,
  ) {
    const { member_id } =
      createMembershipDto;

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
        membership_member_id:
          membershipMemberId,
      });

    return this.membershipRepository.save(
      membership,
    );
  }

  // ============================================================
  // GET ALL MEMBERSHIPS
  // ============================================================

  async findAll() {
    return this.membershipRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  // ============================================================
  // GET MEMBERSHIP BY ID
  // ============================================================

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

  // ============================================================
  // GET MEMBERSHIP BY MEMBER ID
  // ============================================================

  async findByMemberId(
    member_id: string,
  ) {
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

  // ============================================================
  // UPDATE ADMIN PROFILE
  //
  // PATCH /membership/member/:id
  // ============================================================

  async updateMemberProfile(
    id: number,
    data: {
      full_name: string;
      email: string;
      mobile: string;
    },
  ) {
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

    // ----------------------------------------------------------
    // FULL NAME
    // ----------------------------------------------------------

    const fullName =
      data.full_name?.trim();

    if (!fullName) {
      throw new BadRequestException(
        'Full name is required',
      );
    }

    // ----------------------------------------------------------
    // EMAIL
    // ----------------------------------------------------------

    const email =
      data.email?.trim();

    if (!email) {
      throw new BadRequestException(
        'Email is required',
      );
    }

    // ----------------------------------------------------------
    // MOBILE
    // ----------------------------------------------------------

    const mobile =
      data.mobile?.trim();

    if (!mobile) {
      throw new BadRequestException(
        'Mobile number is required',
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      throw new BadRequestException(
        'Please enter a valid 10-digit mobile number',
      );
    }

    // ----------------------------------------------------------
    // EMAIL DUPLICATE CHECK
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // MOBILE DUPLICATE CHECK
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // UPDATE PROFILE
    // ----------------------------------------------------------

    member.full_name =
      fullName;

    member.email =
      email;

    member.mobile =
      mobile;

    const updatedMember =
      await this.memberRepository.save(
        member,
      );

    return {
      message:
        'Admin profile updated successfully.',

      user: {
        id: updatedMember.id,
        member_id:
          updatedMember.member_id,
        avs_id:
          updatedMember.avs_id,
        full_name:
          updatedMember.full_name,
        email:
          updatedMember.email,
        mobile:
          updatedMember.mobile,
      },
    };
  }

  // ============================================================
  // AUTHORIZE MEMBER FOR MATRIMONY
  //
  // PATCH /membership/member/:id/authorize-matrimony
  // ============================================================

  async authorizeMatrimony(
    id: number,
    expiryDate: string,
  ) {
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

    // ----------------------------------------------------------
    // MEMBER STATUS
    // ----------------------------------------------------------

    if (
      member.status !== 'Active'
    ) {
      throw new BadRequestException(
        'Only Active members can be authorised for matrimony',
      );
    }

    // ----------------------------------------------------------
    // EXPIRY DATE
    // ----------------------------------------------------------

    if (!expiryDate) {
      throw new BadRequestException(
        'Matrimony expiry date is required',
      );
    }

    const expiry =
      new Date(expiryDate);

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0,
    );

    expiry.setHours(
      0,
      0,
      0,
      0,
    );

    if (expiry <= today) {
      throw new BadRequestException(
        'Expiry date must be a future date',
      );
    }

    // ----------------------------------------------------------
    // ALREADY AUTHORISED
    // ----------------------------------------------------------

    if (
      member.matrimony_authorised &&
      member.matrimony_code
    ) {
      throw new ConflictException(
        `Matrimony already authorised. Code: ${member.matrimony_code}`,
      );
    }

    // ----------------------------------------------------------
    // GENERATE MATRIMONY CODE
    //
    // Example:
    // AVMS0000001
    // ----------------------------------------------------------

    const lastMember =
      await this.memberRepository
        .createQueryBuilder('member')
        .where(
          'member.matrimony_code IS NOT NULL',
        )
        .orderBy(
          'member.id',
          'DESC',
        )
        .getOne();

    let nextNumber = 1;

    if (
      lastMember &&
      lastMember.matrimony_code
    ) {
      const match =
        lastMember.matrimony_code.match(
          /(\d+)$/,
        );

      if (match) {
        nextNumber =
          Number(match[1]) + 1;
      }
    }

    const matrimonyCode =
      `AVMS${String(nextNumber).padStart(7, '0')}`;

    // ----------------------------------------------------------
    // SAVE AUTHORISATION
    // ----------------------------------------------------------

    member.matrimony_code =
      matrimonyCode;

    member.matrimony_authorised =
      true;

    member.matrimony_authorised_date =
      new Date();

    member.matrimony_expiry_date =
      expiry;

    const updatedMember =
      await this.memberRepository.save(
        member,
      );

    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

    return {
      message:
        'Matrimony authorised successfully.',

      member: {
        id:
          updatedMember.id,

        member_id:
          updatedMember.member_id,

        avs_id:
          updatedMember.avs_id,

        full_name:
          updatedMember.full_name,

        mobile:
          updatedMember.mobile,

        matrimony_code:
          updatedMember.matrimony_code,

        matrimony_authorised:
          updatedMember.matrimony_authorised,

        matrimony_authorised_date:
          updatedMember.matrimony_authorised_date,

        matrimony_expiry_date:
          updatedMember.matrimony_expiry_date,
      },
    };
  }
}