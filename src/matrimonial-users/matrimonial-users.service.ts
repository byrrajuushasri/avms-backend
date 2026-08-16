import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { MatrimonialUser } from './entities/matrimonial-user.entity';

@Injectable()
export class MatrimonialUsersService {
  constructor(
    @InjectRepository(MatrimonialUser)
    private readonly userRepository: Repository<MatrimonialUser>,
  ) {}

  // ==========================================
  // CREATE MATRIMONIAL USER
  // ==========================================

  async register(
    data: any,
    photo?: Express.Multer.File,
  ) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: data.email },
        { mobile: data.mobile },
      ],
    });

    if (existingUser) {
      return {
        success: false,
        message: 'Email or Mobile already registered',
      };
    }

    const user = new MatrimonialUser();

    user.profile_category = data.profileCategory || null;
    user.surname = data.surname || null;
    user.name = data.name;
    user.father_name = data.fatherName || null;
    user.mother_name = data.motherName || null;

    user.gotram = data.gotram || null;
    user.nakshatram = data.nakshatram || null;

    user.padham =
      data.padham === '' || data.padham == null
        ? null
        : Number(data.padham);

    user.rasi = data.rasi || null;

    user.date_of_birth = data.dateOfBirth
      ? new Date(data.dateOfBirth)
      : null;

    user.color = data.color || null;
    user.height = data.height || null;

    user.email = data.email || null;
    user.mobile = data.mobile || null;

    user.password = await bcrypt.hash(
      data.password || '',
      10,
    );

    user.education = data.education || null;
    user.occupation = data.occupation || null;
    user.annual_income = data.salary || null;

    user.address = data.address || null;

    user.family_details =
      data.familyDetails || null;

    user.brother_details =
      data.brotherDetails || null;

    user.sister_details =
      data.sisterDetails || null;

    user.property_details =
      data.propertyDetails || null;

    user.preferred_requirements =
      data.preferredRequirements || null;

    // PHOTO
    if (photo) {
  user.photo = photo.filename;
}

    // STATUS
    user.status =
      data.status || 'Pending';

    // MEMBERSHIP
    user.membership =
      data.membership || 'Free';

    // TEMP MEMBER ID
    user.member_id =
      `TEMP_${Date.now()}`;

    // SAVE
    const savedUser =
      await this.userRepository.save(user);

    // FINAL MEMBER ID
    savedUser.member_id =
      `AVM${String(savedUser.id).padStart(6, '0')}`;

    await this.userRepository.save(savedUser);

    return {
      success: true,
      message:
        'Matrimonial member added successfully',

      data: {
        id: savedUser.id,
        member_id: savedUser.member_id,
        name: savedUser.name,
        email: savedUser.email,
        mobile: savedUser.mobile,
        photo: savedUser.photo,
        status: savedUser.status,
        membership: savedUser.membership,
      },
    };
  }

  // ==========================================
  // GET ALL USERS
  // ==========================================

  async findAll(): Promise<MatrimonialUser[]> {
    return await this.userRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  // ==========================================
  // GET ONE USER
  // ==========================================

  async findOne(
    id: number,
  ): Promise<MatrimonialUser | null> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  // ==========================================
  // UPDATE USER
  // ==========================================

  async update(
    id: number,
    data: any,
  ) {
    const member =
      await this.userRepository.findOne({
        where: {
          id,
        },
      });

    if (!member) {
      throw new NotFoundException(
        'Matrimonial member not found',
      );
    }

    // Do not overwrite password unless provided
    if (data.password) {
      data.password =
        await bcrypt.hash(
          data.password,
          10,
        );
    } else {
      delete data.password;
    }

    Object.assign(member, data);

    return await this.userRepository.save(member);
  }
}