import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

import {
  MatrimonialUser,
} from './entities/matrimonial-user.entity';

@Injectable()
export class MatrimonialUsersService {
  constructor(
    @InjectRepository(MatrimonialUser)
    private readonly userRepository: Repository<MatrimonialUser>,
  ) {}

  // =====================================================
  // REGISTER
  // =====================================================

  async register(
    data: any,
    photo?: Express.Multer.File,
  ) {
    console.log(
      '========== MATRIMONIAL REGISTER ==========',
    );

    console.log('Received data:', data);
    console.log(
      'Photo:',
      photo?.filename || 'No photo',
    );

    // =====================================================
    // DUPLICATE EMAIL / MOBILE
    // =====================================================

    const existingUser =
      await this.userRepository.findOne({
        where: [
          {
            email: data.email,
          },
          {
            mobile: data.mobile,
          },
        ],
      });

    if (existingUser) {
      return {
        success: false,
        message:
          'Email or Mobile already registered',
      };
    }

    // =====================================================
    // CREATE USER
    // =====================================================

    const user =
      new MatrimonialUser();

    // =====================================================
    // PERSONAL INFORMATION
    // =====================================================

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

    // =====================================================
    // HOROSCOPE
    // =====================================================

    user.gotram =
      data.gotram || null;

    user.nakshatram =
      data.nakshatram || null;

    // =====================================================
    // PADHAM
    // =====================================================

    if (
      data.padham === '' ||
      data.padham === null ||
      data.padham === undefined
    ) {
      user.padham = null;
    } else {
      const padhamNumber =
        Number(data.padham);

      user.padham =
        Number.isNaN(padhamNumber)
          ? null
          : padhamNumber;
    }

    // =====================================================
    // RASI
    // =====================================================

    user.rasi =
      data.rasi || null;

    // =====================================================
    // DATE OF BIRTH
    // =====================================================

    if (!data.date_of_birth) {
      user.date_of_birth = null;
    } else {
      const date =
        new Date(data.date_of_birth);

      user.date_of_birth =
        Number.isNaN(date.getTime())
          ? null
          : date;
    }

    // =====================================================
    // PERSONAL DETAILS
    // =====================================================

    user.color =
      data.color || null;

    user.height =
      data.height || null;

    // =====================================================
    // ACCOUNT
    // =====================================================

    user.email =
      data.email || null;

    user.mobile =
      data.mobile || null;

    // =====================================================
    // PASSWORD
    // =====================================================

    user.password =
      await bcrypt.hash(
        data.password || '',
        10,
      );

    // =====================================================
    // EDUCATION & CAREER
    // =====================================================

    user.education =
      data.education || null;

    user.occupation =
      data.occupation || null;

    user.annual_income =
      data.annual_income || null;

    // =====================================================
    // ADDRESS
    // =====================================================

    user.address =
      data.address || null;

    // =====================================================
    // FAMILY DETAILS
    // =====================================================

    user.family_details =
      data.family_details || null;

    user.brother_details =
      data.brother_details || null;

    user.sister_details =
      data.sister_details || null;

    user.property_details =
      data.property_details || null;

    // =====================================================
    // PREFERRED REQUIREMENTS
    // =====================================================

    user.preferred_requirements =
      data.preferred_requirements || null;

    // =====================================================
    // PHOTO
    // =====================================================

    if (photo) {
      user.photo =
        photo.filename;
    }

    // IMPORTANT:
    // Do NOT set user.photo = null here.
    // Entity photo is string type.

    // =====================================================
    // STATUS
    // =====================================================

    user.status =
      data.status || 'Pending';

    // =====================================================
    // MEMBERSHIP
    // =====================================================

    user.membership =
      data.membership || 'Free';

    // =====================================================
    // TEMP MEMBER ID
    // =====================================================

    user.member_id =
      `TEMP_${Date.now()}`;

    // =====================================================
    // SAVE
    // =====================================================

    const savedUser =
      await this.userRepository.save(
        user,
      );

    // =====================================================
    // FINAL MEMBER ID
    // =====================================================

    savedUser.member_id =
      `AVM${String(
        savedUser.id,
      ).padStart(6, '0')}`;

    await this.userRepository.save(
      savedUser,
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return {
      success: true,

      message:
        'Matrimonial member added successfully',

      data: {
        id: savedUser.id,

        member_id:
          savedUser.member_id,

        name:
          savedUser.name,

        email:
          savedUser.email,

        mobile:
          savedUser.mobile,

        photo:
          savedUser.photo,

        status:
          savedUser.status,

        membership:
          savedUser.membership,
      },
    };
  }

  // =====================================================
  // GET ALL USERS
  // =====================================================

  async findAll(): Promise<MatrimonialUser[]> {
    return await this.userRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  // =====================================================
  // GET ONE USER
  // =====================================================

  async findOne(
    id: number,
  ): Promise<MatrimonialUser | null> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  // =====================================================
  // UPDATE USER
  // =====================================================

  async update(
    id: number,
    data: any,
    photo?: Express.Multer.File,
  ) {
    console.log(
      '========== MATRIMONIAL UPDATE ==========',
    );

    console.log(
      'Member ID:',
      id,
    );

    console.log(
      'Received update data:',
      data,
    );

    console.log(
      'New photo:',
      photo?.filename || 'No new photo',
    );

    // =====================================================
    // FIND MEMBER
    // =====================================================

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

    // =====================================================
    // PERSONAL INFORMATION
    // =====================================================

    member.profile_category =
      data.profile_category ??
      member.profile_category;

    member.surname =
      data.surname ??
      member.surname;

    member.name =
      data.name ??
      member.name;

    member.father_name =
      data.father_name ??
      member.father_name;

    member.mother_name =
      data.mother_name ??
      member.mother_name;

    // =====================================================
    // HOROSCOPE
    // =====================================================

    member.gotram =
      data.gotram ??
      member.gotram;

    member.nakshatram =
      data.nakshatram ??
      member.nakshatram;

    // =====================================================
    // PADHAM
    // =====================================================

    if (
      data.padham === '' ||
      data.padham === null ||
      data.padham === undefined
    ) {
      member.padham = null;
    } else {
      const padhamNumber =
        Number(data.padham);

      member.padham =
        Number.isNaN(padhamNumber)
          ? null
          : padhamNumber;
    }

    // =====================================================
    // RASI
    // =====================================================

    member.rasi =
      data.rasi ??
      member.rasi;

    // =====================================================
    // DATE OF BIRTH
    // =====================================================

    if (
      data.date_of_birth === '' ||
      data.date_of_birth === null ||
      data.date_of_birth === undefined
    ) {
      member.date_of_birth = null;
    } else {
      const date =
        new Date(
          data.date_of_birth,
        );

      if (
        !Number.isNaN(
          date.getTime(),
        )
      ) {
        member.date_of_birth =
          date;
      }
    }

    // =====================================================
    // PERSONAL DETAILS
    // =====================================================

    member.color =
      data.color ??
      member.color;

    member.height =
      data.height ??
      member.height;

    // =====================================================
    // CONTACT
    // =====================================================

    member.email =
      data.email ??
      member.email;

    member.mobile =
      data.mobile ??
      member.mobile;

    // =====================================================
    // PASSWORD
    // =====================================================

    // Only update password if user entered a new password.

    if (
      data.password &&
      typeof data.password === 'string' &&
      data.password.trim() !== ''
    ) {
      member.password =
        await bcrypt.hash(
          data.password.trim(),
          10,
        );
    }

    // =====================================================
    // EDUCATION & CAREER
    // =====================================================

    member.education =
      data.education ??
      member.education;

    member.occupation =
      data.occupation ??
      member.occupation;

    member.annual_income =
      data.annual_income ??
      member.annual_income;

    // =====================================================
    // ADDRESS
    // =====================================================

    member.address =
      data.address ??
      member.address;

    // =====================================================
    // FAMILY DETAILS
    // =====================================================

    member.family_details =
      data.family_details ??
      member.family_details;

    member.brother_details =
      data.brother_details ??
      member.brother_details;

    member.sister_details =
      data.sister_details ??
      member.sister_details;

    member.property_details =
      data.property_details ??
      member.property_details;

    // =====================================================
    // PREFERRED REQUIREMENTS
    // =====================================================

    member.preferred_requirements =
      data.preferred_requirements ??
      member.preferred_requirements;

    // =====================================================
    // STATUS
    // =====================================================

    member.status =
      data.status ??
      member.status ??
      'Pending';

    // =====================================================
    // MEMBERSHIP
    // =====================================================

    member.membership =
      data.membership ??
      member.membership ??
      'Free';

    // =====================================================
    // PHOTO
    // =====================================================

    if (photo) {
      // New photo uploaded.
      // Replace old photo.

      member.photo =
        photo.filename;

      console.log(
        'Photo updated:',
        photo.filename,
      );
    } else {
      // No new photo.
      // Keep existing photo.

      console.log(
        'No new photo. Existing photo kept:',
        member.photo,
      );
    }

    // =====================================================
    // SAVE
    // =====================================================

    console.log(
      'Saving matrimonial member...',
    );

    try {
      const updatedUser =
        await this.userRepository.save(
          member,
        );

      console.log(
        'Updated successfully:',
        updatedUser.id,
      );

      console.log(
        'Updated photo:',
        updatedUser.photo,
      );

      // =====================================================
      // RESPONSE
      // =====================================================

      return {
        success: true,

        message:
          'Matrimonial member updated successfully',

        data: updatedUser,
      };
    } catch (error) {
      console.error(
        '========== UPDATE DATABASE ERROR ==========',
      );

      console.error(error);

      console.error(
        '==========================================',
      );

      throw error;
    }
  }
}