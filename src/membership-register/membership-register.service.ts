import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MembershipRegister } from './membership-register.entity';
import { CreateMembershipRegisterDto } from './dto/create-membership-register.dto';

@Injectable()
export class MembershipRegisterService {
  constructor(
    @InjectRepository(MembershipRegister)
    private readonly membershipRegisterRepository: Repository<MembershipRegister>,
  ) {}

  // =========================
  // CREATE MEMBER
  // =========================
  async create(
    createMembershipRegisterDto: CreateMembershipRegisterDto,
  ): Promise<MembershipRegister> {
    const member =
      this.membershipRegisterRepository.create(
        createMembershipRegisterDto,
      );

    return await this.membershipRegisterRepository.save(
      member,
    );
  }

  // =========================
  // GET ALL MEMBERS
  // =========================
  async findAll(): Promise<MembershipRegister[]> {
    return await this.membershipRegisterRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  // =========================
  // GET MEMBER BY ID
  // =========================
  async findOne(
    id: number,
  ): Promise<MembershipRegister> {
    const member =
      await this.membershipRegisterRepository.findOne({
        where: { id },
      });

    if (!member) {
      throw new NotFoundException(
        'Membership member not found',
      );
    }

    return member;
  }

  // =========================
  // UPDATE MEMBER
  // =========================
  async update(
    id: number,
    updateMembershipRegisterDto: CreateMembershipRegisterDto,
  ): Promise<MembershipRegister> {
    const member =
      await this.membershipRegisterRepository.findOne({
        where: { id },
      });

    if (!member) {
      throw new NotFoundException(
        'Membership member not found',
      );
    }

    member.full_name =
      updateMembershipRegisterDto.full_name;

    member.mobile =
      updateMembershipRegisterDto.mobile;

    member.email =
      updateMembershipRegisterDto.email;

    member.password =
      updateMembershipRegisterDto.password;

    member.gender =
      updateMembershipRegisterDto.gender;

    return await this.membershipRegisterRepository.save(
      member,
    );
  }
}