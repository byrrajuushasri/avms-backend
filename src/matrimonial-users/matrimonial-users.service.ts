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
  console.log("========== MATRIMONIAL REGISTER ==========");
  console.log("Received data:", data);
  console.log("Profile Category:", data.profile_category);
  console.log("==========================================");

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

  // ==========================================
  // PERSONAL INFORMATION
  // ==========================================

  user.profile_category =
    data.profile_category || null;

  user.surname =
    data.surname || null;

  user.name =
    data.name || null;

  user.father_name =
    data.father_name || null;

  user.mother_name =
    data.mother_name || null;

  user.gotram =
    data.gotram || null;

  user.nakshatram =
    data.nakshatram || null;

  // ==========================================
  // PADHAM
  // ==========================================

  user.padham =
    data.padham === '' ||
    data.padham === undefined ||
    data.padham === null
      ? null
      : Number(data.padham);

  // ==========================================
  // RASI
  // ==========================================

  user.rasi =
    data.rasi || null;

  // ==========================================
  // DATE OF BIRTH
  // ==========================================

  user.date_of_birth =
    data.date_of_birth
      ? new Date(data.date_of_birth)
      : null;

  // ==========================================
  // PERSONAL DETAILS
  // ==========================================

  user.color =
    data.color || null;

  user.height =
    data.height || null;

  // ==========================================
  // ACCOUNT
  // ==========================================

  user.email =
    data.email || null;

  user.mobile =
    data.mobile || null;

  user.password =
    await bcrypt.hash(
      data.password || '',
      10,
    );

  // ==========================================
  // EDUCATION & CAREER
  // ==========================================

  user.education =
    data.education || null;

  user.occupation =
    data.occupation || null;

  user.annual_income =
    data.annual_income || null;

  // ==========================================
  // ADDRESS
  // ==========================================

  user.address =
    data.address || null;

  // ==========================================
  // FAMILY
  // ==========================================

  user.family_details =
    data.family_details || null;

  user.brother_details =
    data.brother_details || null;

  user.sister_details =
    data.sister_details || null;

  user.property_details =
    data.property_details || null;

  // ==========================================
  // PREFERRED REQUIREMENTS
  // ==========================================

  user.preferred_requirements =
    data.preferred_requirements || null;

  // ==========================================
  // PHOTO
  // ==========================================

  if (photo) {
    user.photo = photo.filename;
  }

  // ==========================================
  // STATUS
  // ==========================================

  user.status =
    data.status || 'Pending';

  // ==========================================
  // MEMBERSHIP
  // ==========================================

  user.membership =
    data.membership || 'Free';

  // ==========================================
  // TEMP MEMBER ID
  // ==========================================

  user.member_id =
    `TEMP_${Date.now()}`;

  // ==========================================
  // SAVE
  // ==========================================

  const savedUser =
    await this.userRepository.save(user);

  // ==========================================
  // FINAL MEMBER ID
  // ==========================================

  savedUser.member_id =
    `AVM${String(savedUser.id).padStart(6, '0')}`;

  await this.userRepository.save(savedUser);

  // ==========================================
  // RESPONSE
  // ==========================================

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