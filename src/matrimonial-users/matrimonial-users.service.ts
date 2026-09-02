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

import {
  MembershipRegister,
} from '../membership-register/entities/membership-register.entity';

@Injectable()
export class MatrimonialUsersService {
  constructor(
    @InjectRepository(MatrimonialUser)
    private readonly userRepository: Repository<MatrimonialUser>,

    @InjectRepository(MembershipRegister)
    private readonly memberRepository: Repository<MembershipRegister>,
  ) {}

  // =====================================================
  // CHECK MEMBER BEFORE MATRIMONIAL REGISTRATION
  // =====================================================

  async checkMember(data: any) {
    console.log(
      '========== CHECK MEMBER BEFORE MATRIMONIAL ==========',
    );

    const mobile =
      data?.mobile !== undefined &&
      data?.mobile !== null
        ? String(data.mobile).trim()
        : '';

    const email =
      data?.email !== undefined &&
      data?.email !== null
        ? String(data.email).trim().toLowerCase()
        : '';

    console.log('Mobile:', mobile);
    console.log('Email:', email);

    // ===================================================
    // MOBILE / EMAIL REQUIRED
    // ===================================================

    if (!mobile && !email) {
      return {
        success: false,
        canRegister: false,
        message:
          'Please enter Mobile Number or Email.',
      };
    }

    // ===================================================
    // FIND MEMBER
    // ===================================================

    const conditions: any[] = [];

    if (mobile) {
      conditions.push({
        mobile,
      });
    }

    if (email) {
      conditions.push({
        email,
      });
    }

    const member =
      await this.memberRepository.findOne({
        where: conditions,
      });

    // ===================================================
    // MEMBER NOT FOUND
    // ===================================================

    if (!member) {
      return {
        success: false,
        canRegister: false,
        message:
          'Please register as a member first. Then you can register for Matrimonial.',
      };
    }

    console.log(
      'Member found:',
      member.member_id,
    );

    // ===================================================
    // CHECK MATRIMONIAL USING MEMBER ID
    // ===================================================

    const existingMatrimonial =
      await this.userRepository.findOne({
        where: {
          member_id: member.member_id,
        },
      });

    // ===================================================
    // ALREADY REGISTERED
    // ===================================================

    if (existingMatrimonial) {
      return {
        success: false,
        canRegister: false,
        alreadyRegistered: true,

        message:
          'This Member is already registered in Matrimonial.',

        data: {
          member_id:
            member.member_id,

          matrimonial_id:
            existingMatrimonial.id,

          full_name:
            member.full_name,

          mobile:
            member.mobile,

          email:
            member.email,

          gender:
            member.gender,

          occupation:
            member.occupation,

          date_of_birth:
            member.date_of_birth,

          photo:
            member.photo,
        },
      };
    }

    // ===================================================
    // MEMBER VERIFIED
    // ===================================================

    return {
      success: true,
      canRegister: true,
      alreadyRegistered: false,

      message:
        'Member verified. You can register for Matrimonial.',

      data: {
        member_id:
          member.member_id,

        full_name:
          member.full_name,

        mobile:
          member.mobile,

        email:
          member.email,

        gender:
          member.gender,

        occupation:
          member.occupation,

        date_of_birth:
          member.date_of_birth,

        photo:
          member.photo,
      },
    };
  }

  // =====================================================
  // REGISTER MATRIMONIAL PROFILE
  // =====================================================

  async register(
    data: any,
    photo?: Express.Multer.File,
  ) {
    console.log(
      '========== MATRIMONIAL REGISTER ==========',
    );

    console.log(
      'Received matrimonial data:',
      data,
    );

    console.log(
      'Received photo:',
      photo?.filename || 'No photo',
    );

    // ===================================================
    // MEMBER ID
    // ===================================================

    const memberId =
      data?.member_id
        ? String(data.member_id).trim()
        : '';

    if (!memberId) {
      return {
        success: false,
        canRegister: false,
        message:
          'Membership verification is required.',
      };
    }

    // ===================================================
    // FIND MEMBER
    // ===================================================

    const member =
      await this.memberRepository.findOne({
        where: {
          member_id: memberId,
        },
      });

    if (!member) {
      return {
        success: false,
        canRegister: false,
        message:
          'Membership record not found. Please verify your membership again.',
      };
    }

    console.log(
      'Verified Membership:',
      member.member_id,
    );

    console.log(
      'Member Name:',
      member.full_name,
    );

    console.log(
      'Member Mobile:',
      member.mobile,
    );

    console.log(
      'Member Email:',
      member.email,
    );

    // ===================================================
    // CHECK EXISTING MATRIMONIAL
    // ===================================================

    const existingUser =
      await this.userRepository.findOne({
        where: {
          member_id: member.member_id,
        },
      });

    if (existingUser) {
      return {
        success: false,
        canRegister: false,
        alreadyRegistered: true,

        message:
          'This Member is already registered in Matrimonial.',

        data: {
          id:
            existingUser.id,

          member_id:
            member.member_id,

          full_name:
            member.full_name,

          mobile:
            member.mobile,

          email:
            member.email,

          gender:
            member.gender,

          occupation:
            member.occupation,

          date_of_birth:
            member.date_of_birth,

          photo:
            member.photo,
        },
      };
    }

    // ===================================================
    // CREATE MATRIMONIAL USER
    // ===================================================

    const user =
      new MatrimonialUser();

    // ===================================================
    // MEMBER ID
    // ===================================================

    user.member_id =
      member.member_id;

    // ===================================================
    // PROFILE CATEGORY
    // ===================================================

    user.profile_category =
      data?.profile_category || null;

    // ===================================================
    // FATHER NAME
    // ===================================================

    user.father_name =
      data?.father_name || null;

    // ===================================================
    // MOTHER NAME
    // ===================================================

    user.mother_name =
      data?.mother_name || null;

    // ===================================================
    // FATHER GOTRAM
    // ===================================================

    user.father_gotram =
      data?.father_gotram || null;

    // ===================================================
    // MOTHER GOTRAM
    // ===================================================

    user.mother_gotram =
      data?.mother_gotram || null;

    // ===================================================
    // GRANDMOTHER GOTRAM
    // ===================================================

    user.grandmother_gotram =
      data?.grandmother_gotram || null;

    // ===================================================
    // NAKSHATRAM
    // ===================================================

    user.nakshatram =
      data?.nakshatram || null;

    // ===================================================
    // PADHAM
    // ===================================================

    if (
      data?.padham === '' ||
      data?.padham === null ||
      data?.padham === undefined
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

    // ===================================================
    // RASI
    // ===================================================

    user.rasi =
      data?.rasi || null;

    // ===================================================
    // COLOR
    // ===================================================

    user.color =
      data?.color || null;

    // ===================================================
    // HEIGHT
    // ===================================================

    user.height =
      data?.height || null;

    // ===================================================
    // EDUCATION
    // ===================================================

    user.education =
      data?.education || null;

    // ===================================================
    // ANNUAL INCOME
    // ===================================================

    user.annual_income =
      data?.annual_income || null;

    // ===================================================
    // ADDRESS
    // ===================================================

    user.address =
      data?.address || null;

    // ===================================================
    // FAMILY DETAILS
    // ===================================================

    user.family_details =
      data?.family_details || null;

    // ===================================================
    // BROTHER DETAILS
    // ===================================================

    user.brother_details =
      data?.brother_details || null;

    // ===================================================
    // SISTER DETAILS
    // ===================================================

    user.sister_details =
      data?.sister_details || null;

    // ===================================================
    // PROPERTY DETAILS
    // ===================================================

    user.property_details =
      data?.property_details || null;

    // ===================================================
    // PREFERRED REQUIREMENTS
    // ===================================================

    user.preferred_requirements =
      data?.preferred_requirements || null;

    // ===================================================
    // PASSWORD
    // ===================================================

    /*
      Matrimonial login password.

      If frontend sends password,
      hash it before storing.

      Otherwise create a temporary password hash.
    */

    let password =
      data?.password
        ? String(data.password).trim()
        : '';

    if (!password) {
      password =
        `${member.member_id}_${Date.now()}`;
    }

    user.password =
      await bcrypt.hash(
        password,
        10,
      );

    // ===================================================
    // STATUS
    // ===================================================

    user.status =
      data?.status || 'Pending';

    // ===================================================
    // SAVE
    // ===================================================

    try {
      const savedUser =
        await this.userRepository.save(
          user,
        );

      console.log(
        'Matrimonial record saved:',
        savedUser.id,
      );

      // =================================================
      // SUCCESS
      // =================================================

      return {
        success: true,

        message:
          'Matrimonial member added successfully',

        data: {
          id:
            savedUser.id,

          member_id:
            savedUser.member_id,

          member_source_id:
            member.member_id,

          full_name:
            member.full_name,

          name:
            member.full_name,

          mobile:
            member.mobile,

          email:
            member.email,

          gender:
            member.gender,

          occupation:
            member.occupation,

          date_of_birth:
            member.date_of_birth,

          photo:
            member.photo,

          matrimonial_photo:
            photo?.filename || null,

          status:
            savedUser.status,
        },
      };
    } catch (error) {
      console.error(
        '========== MATRIMONIAL DATABASE ERROR ==========',
      );

      console.error(error);

      console.error(
        '================================================',
      );

      throw error;
    }
  }

  // =====================================================
  // GET ALL MATRIMONIAL USERS
  // =====================================================

  async findAll() {
    const matrimonialUsers =
      await this.userRepository.find({
        order: {
          created_at: 'DESC',
        },
      });

    // ===================================================
    // GET MEMBER DETAILS
    // ===================================================

    const result = await Promise.all(
      matrimonialUsers.map(
        async (matrimonial) => {
          const member =
            await this.memberRepository.findOne({
              where: {
                member_id:
                  matrimonial.member_id,
              },
            });

          return {
            ...matrimonial,

            // Member details
            full_name:
              member?.full_name || null,

            name:
              member?.full_name || null,

            mobile:
              member?.mobile || null,

            email:
              member?.email || null,

            gender:
              member?.gender || null,

            occupation:
              member?.occupation || null,

            date_of_birth:
              member?.date_of_birth || null,

            photo:
              member?.photo || null,

            district:
              member?.district || null,

            mandal:
              member?.mandal || null,

            sangham:
              member?.sangham || null,
          };
        },
      ),
    );

    return result;
  }

  // =====================================================
  // GET ONE MATRIMONIAL USER
  // =====================================================

  async findOne(id: number) {
    const matrimonial =
      await this.userRepository.findOne({
        where: {
          id,
        },
      });

    if (!matrimonial) {
      return null;
    }

    // ===================================================
    // GET MEMBER DETAILS
    // ===================================================

    const member =
      await this.memberRepository.findOne({
        where: {
          member_id:
            matrimonial.member_id,
        },
      });

    return {
      ...matrimonial,

      full_name:
        member?.full_name || null,

      name:
        member?.full_name || null,

      mobile:
        member?.mobile || null,

      email:
        member?.email || null,

      gender:
        member?.gender || null,

      occupation:
        member?.occupation || null,

      date_of_birth:
        member?.date_of_birth || null,

      photo:
        member?.photo || null,

      district:
        member?.district || null,

      mandal:
        member?.mandal || null,

      sangham:
        member?.sangham || null,
    };
  }

  // =====================================================
  // UPDATE MATRIMONIAL USER
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
      'Matrimonial ID:',
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

    // ===================================================
    // FIND MATRIMONIAL USER
    // ===================================================

    const matrimonial =
      await this.userRepository.findOne({
        where: {
          id,
        },
      });

    if (!matrimonial) {
      throw new NotFoundException(
        'Matrimonial member not found',
      );
    }

    // ===================================================
    // PROFILE CATEGORY
    // ===================================================

    if (
      data?.profile_category !== undefined
    ) {
      matrimonial.profile_category =
        data.profile_category;
    }

    // ===================================================
    // FATHER NAME
    // ===================================================

    if (
      data?.father_name !== undefined
    ) {
      matrimonial.father_name =
        data.father_name;
    }

    // ===================================================
    // MOTHER NAME
    // ===================================================

    if (
      data?.mother_name !== undefined
    ) {
      matrimonial.mother_name =
        data.mother_name;
    }

    // ===================================================
    // FATHER GOTRAM
    // ===================================================

    if (
      data?.father_gotram !== undefined
    ) {
      matrimonial.father_gotram =
        data.father_gotram;
    }

    // ===================================================
    // MOTHER GOTRAM
    // ===================================================

    if (
      data?.mother_gotram !== undefined
    ) {
      matrimonial.mother_gotram =
        data.mother_gotram;
    }

    // ===================================================
    // GRANDMOTHER GOTRAM
    // ===================================================

    if (
      data?.grandmother_gotram !== undefined
    ) {
      matrimonial.grandmother_gotram =
        data.grandmother_gotram;
    }

    // ===================================================
    // NAKSHATRAM
    // ===================================================

    if (
      data?.nakshatram !== undefined
    ) {
      matrimonial.nakshatram =
        data.nakshatram;
    }

    // ===================================================
    // PADHAM
    // ===================================================

    if (
      data?.padham === '' ||
      data?.padham === null
    ) {
      matrimonial.padham = null;
    } else if (
      data?.padham !== undefined
    ) {
      const padhamNumber =
        Number(data.padham);

      if (
        !Number.isNaN(padhamNumber)
      ) {
        matrimonial.padham =
          padhamNumber;
      }
    }

    // ===================================================
    // RASI
    // ===================================================

    if (
      data?.rasi !== undefined
    ) {
      matrimonial.rasi =
        data.rasi;
    }

    // ===================================================
    // COLOR
    // ===================================================

    if (
      data?.color !== undefined
    ) {
      matrimonial.color =
        data.color;
    }

    // ===================================================
    // HEIGHT
    // ===================================================

    if (
      data?.height !== undefined
    ) {
      matrimonial.height =
        data.height;
    }

    // ===================================================
    // EDUCATION
    // ===================================================

    if (
      data?.education !== undefined
    ) {
      matrimonial.education =
        data.education;
    }

    // ===================================================
    // ANNUAL INCOME
    // ===================================================

    if (
      data?.annual_income !== undefined
    ) {
      matrimonial.annual_income =
        data.annual_income;
    }

    // ===================================================
    // ADDRESS
    // ===================================================

    if (
      data?.address !== undefined
    ) {
      matrimonial.address =
        data.address;
    }

    // ===================================================
    // FAMILY DETAILS
    // ===================================================

    if (
      data?.family_details !== undefined
    ) {
      matrimonial.family_details =
        data.family_details;
    }

    // ===================================================
    // BROTHER DETAILS
    // ===================================================

    if (
      data?.brother_details !== undefined
    ) {
      matrimonial.brother_details =
        data.brother_details;
    }

    // ===================================================
    // SISTER DETAILS
    // ===================================================

    if (
      data?.sister_details !== undefined
    ) {
      matrimonial.sister_details =
        data.sister_details;
    }

    // ===================================================
    // PROPERTY DETAILS
    // ===================================================

    if (
      data?.property_details !== undefined
    ) {
      matrimonial.property_details =
        data.property_details;
    }

    // ===================================================
    // PREFERRED REQUIREMENTS
    // ===================================================

    if (
      data?.preferred_requirements !== undefined
    ) {
      matrimonial.preferred_requirements =
        data.preferred_requirements;
    }

    // ===================================================
    // PASSWORD
    // ===================================================

    if (
      data?.password &&
      typeof data.password === 'string' &&
      data.password.trim() !== ''
    ) {
      matrimonial.password =
        await bcrypt.hash(
          data.password.trim(),
          10,
        );
    }

    // ===================================================
    // STATUS
    // ===================================================

    if (
      data?.status !== undefined
    ) {
      matrimonial.status =
        data.status;
    }

    // ===================================================
    // SAVE
    // ===================================================

    try {
      const updatedUser =
        await this.userRepository.save(
          matrimonial,
        );

      // =================================================
      // GET MEMBER DETAILS
      // =================================================

      const member =
        await this.memberRepository.findOne({
          where: {
            member_id:
              updatedUser.member_id,
          },
        });

      console.log(
        'Matrimonial member updated:',
        updatedUser.id,
      );

      return {
        success: true,

        message:
          'Matrimonial member updated successfully',

        data: {
          ...updatedUser,

          full_name:
            member?.full_name || null,

          name:
            member?.full_name || null,

          mobile:
            member?.mobile || null,

          email:
            member?.email || null,

          gender:
            member?.gender || null,

          occupation:
            member?.occupation || null,

          date_of_birth:
            member?.date_of_birth || null,

          photo:
            member?.photo || null,
        },
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

  // =====================================================
  // DELETE MATRIMONIAL USER
  // =====================================================

  async remove(id: number) {
    const member = await this.userRepository.findOne({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(
        `Matrimonial member with ID ${id} not found`,
      );
    }

    await this.userRepository.remove(member);

    return {
      message: 'Matrimonial profile deleted successfully',
      id,
    };
  }
}
