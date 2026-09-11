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


  // =========================================================
  // CHECK MEMBER
  // =========================================================



async checkMember(data: any) {

  console.log(
    '========== CHECK MEMBER BEFORE MATRIMONIAL ==========',
  );

  const mobile =
    data?.mobile !== undefined &&
    data?.mobile !== null
      ? String(data.mobile).trim()
      : '';

  // Email is no longer required for matrimonial verification
  const email =
    data?.email !== undefined &&
    data?.email !== null
      ? String(data.email).trim().toLowerCase()
      : '';

  console.log('Mobile:', mobile);

  if (!mobile) {
    return {
      success: false,
      canRegister: false,
      message:
        'Please enter a valid Mobile Number.',
    };
  }

  // =======================================================
  // FIND MEMBER BY MOBILE ONLY
  // =======================================================

  const member =
    await this.memberRepository.findOne({
      where: {
        mobile,
      },
    });

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

  console.log(
    'Member Name:',
    member.full_name,
  );

  console.log(
    'Father Name:',
    member.father_name,
  );

  console.log(
    'Member Mobile:',
    member.mobile,
  );

  // =======================================================
  // CHECK EXISTING MATRIMONIAL
  // =======================================================

  const existingMatrimonial =
    await this.userRepository.findOne({
      where: {
        member_id: member.member_id,
      },
    });

  // =======================================================
  // ALREADY REGISTERED
  // =======================================================

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

        // IMPORTANT
        father_name:
          member.father_name || null,

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

  // =======================================================
  // VERIFIED MEMBER
  // =======================================================

  return {

    success: true,

    canRegister: true,

    alreadyRegistered: false,

    message:
      'Member verified. You can now complete the Matrimonial form.',

    data: {

      member_id:
        member.member_id,

      full_name:
        member.full_name,

      // IMPORTANT
      father_name:
        member.father_name || null,

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




  // =========================================================
  // REGISTER MATRIMONIAL MEMBER
  // =========================================================

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


    // -------------------------------------------------------
    // MEMBER ID
    // -------------------------------------------------------

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


    // -------------------------------------------------------
    // FIND MEMBER
    // -------------------------------------------------------

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


    // -------------------------------------------------------
    // CHECK EXISTING MATRIMONIAL
    // -------------------------------------------------------

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


    // =======================================================
    // CREATE MATRIMONIAL USER
    // =======================================================

    const user =
      new MatrimonialUser();


    // -------------------------------------------------------
    // MEMBER ID
    // -------------------------------------------------------

    user.member_id =
      member.member_id;


    // -------------------------------------------------------
    // PROFILE CATEGORY
    // -------------------------------------------------------

    user.profile_category =
      data?.profile_category || null;


    // -------------------------------------------------------
    // FAMILY DETAILS
    // -------------------------------------------------------

    user.father_name =
      data?.father_name || null;

    user.mother_name =
      data?.mother_name || null;


    // =======================================================
    // FATHER OCCUPATION
    // =======================================================

    user.father_occupation =
      data?.father_occupation
        ? String(
            data.father_occupation,
          ).trim()
        : null;


    // =======================================================
    // MOTHER OCCUPATION
    // =======================================================

    user.mother_occupation =
      data?.mother_occupation
        ? String(
            data.mother_occupation,
          ).trim()
        : null;


    // -------------------------------------------------------
    // GOTRAM
    // -------------------------------------------------------

    user.father_gotram =
      data?.father_gotram || null;

    user.mother_gotram =
      data?.mother_gotram || null;

    user.grandmother_gotram =
      data?.grandmother_gotram || null;


    // -------------------------------------------------------
    // NAKSHATRAM
    // -------------------------------------------------------

    user.nakshatram =
      data?.nakshatram || null;


    // -------------------------------------------------------
    // PADHAM
    // -------------------------------------------------------

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


    // -------------------------------------------------------
    // RASI
    // -------------------------------------------------------

    user.rasi =
      data?.rasi || null;


    // -------------------------------------------------------
    // PERSONAL DETAILS
    // -------------------------------------------------------

    user.color =
      data?.color || null;

    user.height =
      data?.height || null;

    user.education =
      data?.education || null;

    user.annual_income =
      data?.annual_income || null;


    // -------------------------------------------------------
    // ADDRESS
    // -------------------------------------------------------

    user.address =
      data?.address || null;


    // -------------------------------------------------------
    // FAMILY DETAILS
    // -------------------------------------------------------

    user.family_details =
      data?.family_details || null;


    // -------------------------------------------------------
    // BROTHER DETAILS
    // -------------------------------------------------------

    user.brother_details =
      data?.brother_details || null;


    // -------------------------------------------------------
    // SISTER DETAILS
    // -------------------------------------------------------

    user.sister_details =
      data?.sister_details || null;


    // -------------------------------------------------------
    // PROPERTY DETAILS
    // -------------------------------------------------------

    user.property_details =
      data?.property_details || null;


    // -------------------------------------------------------
    // PREFERRED REQUIREMENTS
    // -------------------------------------------------------

    user.preferred_requirements =
      data?.preferred_requirements || null;


    // =======================================================
    // AREA VOLUNTEER
    // =======================================================

    user.preference_name =
      data?.preference_name
        ? String(
            data.preference_name,
          ).trim()
        : null;


    user.preference_phone =
      data?.preference_phone
        ? String(
            data.preference_phone,
          ).trim()
        : null;


    user.preference_area =
      data?.preference_area
        ? String(
            data.preference_area,
          ).trim()
        : null;


    // =======================================================
    // CONSENT
    // =======================================================

    user.consent =
      data?.consent === true ||
      data?.consent === 'true' ||
      data?.consent === '1' ||
      data?.consent === 1
        ? 1
        : 0;


    // =======================================================
    // PASSWORD
    // =======================================================

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


    // =======================================================
    // STATUS
    // =======================================================

    user.status =
      data?.status || 'Pending';


    // =======================================================
    // PHOTO
    // =======================================================

    if (photo) {

      console.log(
        '========== SAVING MEMBER PHOTO ==========',
      );

      console.log(
        'Photo filename:',
        photo.filename,
      );


      member.photo =
        `/uploads/matrimonial/${photo.filename}`;


      await this.memberRepository.save(
        member,
      );


      console.log(
        'Member photo saved:',
        member.photo,
      );
    }


    // =======================================================
    // SAVE MATRIMONIAL USER
    // =======================================================

    try {

      const savedUser =
        await this.userRepository.save(
          user,
        );


      console.log(
        'Matrimonial record saved:',
        savedUser.id,
      );


      // -----------------------------------------------------
      // RETURN UPDATED MEMBER
      // -----------------------------------------------------

      const savedMember =
        await this.memberRepository.findOne({
          where: {
            member_id:
              savedUser.member_id,
          },
        });


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
            savedMember?.full_name || null,

          name:
            savedMember?.full_name || null,

          mobile:
            savedMember?.mobile || null,

          email:
            savedMember?.email || null,

          gender:
            savedMember?.gender || null,

          occupation:
            savedMember?.occupation || null,

          date_of_birth:
            savedMember?.date_of_birth || null,

          photo:
            savedMember?.photo || null,

          matrimonial_photo:
            photo?.filename || null,

          father_occupation:
            savedUser.father_occupation || null,

          mother_occupation:
            savedUser.mother_occupation || null,

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



  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll() {

    const matrimonialUsers =
      await this.userRepository.find({

        order: {
          created_at: 'DESC',
        },

      });


    const result =
      await Promise.all(

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


              // ------------------------------------------------
              // MEMBER INFORMATION
              // ------------------------------------------------

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


              // ------------------------------------------------
              // LOCATION
              // ------------------------------------------------

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



  // =========================================================
  // FIND ONE
  // =========================================================

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


    const member =
      await this.memberRepository.findOne({

        where: {
          member_id:
            matrimonial.member_id,
        },

      });


    return {

      ...matrimonial,


      // -------------------------------------------------------
      // MEMBER INFORMATION
      // -------------------------------------------------------

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


      // -------------------------------------------------------
      // LOCATION
      // -------------------------------------------------------

      district:
        member?.district || null,

      mandal:
        member?.mandal || null,

      sangham:
        member?.sangham || null,
    };
  }



  // =========================================================
  // UPDATE
  // =========================================================

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


    // =======================================================
    // FIND MATRIMONIAL
    // =======================================================

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


    // =======================================================
    // FIND MEMBER
    // =======================================================

    const member =
      await this.memberRepository.findOne({

        where: {
          member_id:
            matrimonial.member_id,
        },

      });


    if (!member) {

      throw new NotFoundException(
        'Membership record not found',
      );
    }


    // =======================================================
    // PROFILE CATEGORY
    // =======================================================

    if (
      data?.profile_category !== undefined
    ) {

      matrimonial.profile_category =
        data.profile_category;
    }


    // =======================================================
    // FATHER NAME
    // =======================================================

    if (
      data?.father_name !== undefined
    ) {

      matrimonial.father_name =
        data.father_name;
    }


    // =======================================================
    // MOTHER NAME
    // =======================================================

    if (
      data?.mother_name !== undefined
    ) {

      matrimonial.mother_name =
        data.mother_name;
    }


    // =======================================================
    // FATHER OCCUPATION
    // =======================================================

    if (
      data?.father_occupation !== undefined
    ) {

      matrimonial.father_occupation =
        data.father_occupation
          ? String(
              data.father_occupation,
            ).trim()
          : null;
    }


    // =======================================================
    // MOTHER OCCUPATION
    // =======================================================

    if (
      data?.mother_occupation !== undefined
    ) {

      matrimonial.mother_occupation =
        data.mother_occupation
          ? String(
              data.mother_occupation,
            ).trim()
          : null;
    }


    // =======================================================
    // GOTRAM
    // =======================================================

    if (
      data?.father_gotram !== undefined
    ) {

      matrimonial.father_gotram =
        data.father_gotram;
    }


    if (
      data?.mother_gotram !== undefined
    ) {

      matrimonial.mother_gotram =
        data.mother_gotram;
    }


    if (
      data?.grandmother_gotram !== undefined
    ) {

      matrimonial.grandmother_gotram =
        data.grandmother_gotram;
    }


    // =======================================================
    // NAKSHATRAM
    // =======================================================

    if (
      data?.nakshatram !== undefined
    ) {

      matrimonial.nakshatram =
        data.nakshatram;
    }


    // =======================================================
    // PADHAM
    // =======================================================

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
        !Number.isNaN(
          padhamNumber,
        )
      ) {

        matrimonial.padham =
          padhamNumber;
      }
    }


    // =======================================================
    // RASI
    // =======================================================

    if (
      data?.rasi !== undefined
    ) {

      matrimonial.rasi =
        data.rasi;
    }


    // =======================================================
    // COLOR
    // =======================================================

    if (
      data?.color !== undefined
    ) {

      matrimonial.color =
        data.color;
    }


    // =======================================================
    // HEIGHT
    // =======================================================

    if (
      data?.height !== undefined
    ) {

      matrimonial.height =
        data.height;
    }


    // =======================================================
    // EDUCATION
    // =======================================================

    if (
      data?.education !== undefined
    ) {

      matrimonial.education =
        data.education;
    }


    // =======================================================
    // ANNUAL INCOME
    // =======================================================

    if (
      data?.annual_income !== undefined
    ) {

      matrimonial.annual_income =
        data.annual_income;
    }


    // =======================================================
    // ADDRESS
    // =======================================================

    if (
      data?.address !== undefined
    ) {

      matrimonial.address =
        data.address;
    }


    // =======================================================
    // FAMILY DETAILS
    // =======================================================

    if (
      data?.family_details !== undefined
    ) {

      matrimonial.family_details =
        data.family_details;
    }


    // =======================================================
    // BROTHER DETAILS
    // =======================================================

    if (
      data?.brother_details !== undefined
    ) {

      matrimonial.brother_details =
        data.brother_details;
    }


    // =======================================================
    // SISTER DETAILS
    // =======================================================

    if (
      data?.sister_details !== undefined
    ) {

      matrimonial.sister_details =
        data.sister_details;
    }


    // =======================================================
    // PROPERTY DETAILS
    // =======================================================

    if (
      data?.property_details !== undefined
    ) {

      matrimonial.property_details =
        data.property_details;
    }


    // =======================================================
    // PREFERRED REQUIREMENTS
    // =======================================================

    if (
      data?.preferred_requirements !== undefined
    ) {

      matrimonial.preferred_requirements =
        data.preferred_requirements;
    }


    // =======================================================
    // AREA VOLUNTEER
    // =======================================================

    if (
      data?.preference_name !== undefined
    ) {

      matrimonial.preference_name =
        data.preference_name
          ? String(
              data.preference_name,
            ).trim()
          : null;
    }


    if (
      data?.preference_phone !== undefined
    ) {

      matrimonial.preference_phone =
        data.preference_phone
          ? String(
              data.preference_phone,
            ).trim()
          : null;
    }


    if (
      data?.preference_area !== undefined
    ) {

      matrimonial.preference_area =
        data.preference_area
          ? String(
              data.preference_area,
            ).trim()
          : null;
    }


    // =======================================================
    // CONSENT
    // =======================================================

    if (
      data?.consent !== undefined
    ) {

      matrimonial.consent =
        data.consent === true ||
        data.consent === 'true' ||
        data.consent === '1' ||
        data.consent === 1
          ? 1
          : 0;
    }


    // =======================================================
    // PASSWORD
    // =======================================================

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


    // =======================================================
    // STATUS
    // =======================================================

    if (
      data?.status !== undefined
    ) {

      matrimonial.status =
        data.status;
    }


    // =======================================================
    // UPDATE PHOTO
    // =======================================================

    if (photo) {

      console.log(
        '========== UPDATING MEMBER PHOTO ==========',
      );

      console.log(
        'Member ID:',
        member.member_id,
      );

      console.log(
        'Old Photo:',
        member.photo,
      );

      console.log(
        'New Photo Filename:',
        photo.filename,
      );


      member.photo =
        `/uploads/matrimonial/${photo.filename}`;


      await this.memberRepository.save(
        member,
      );


      console.log(
        'Member photo updated:',
        member.photo,
      );
    }


    // =======================================================
    // SAVE MATRIMONIAL
    // =======================================================

    try {

      const updatedUser =
        await this.userRepository.save(
          matrimonial,
        );


      console.log(
        'Matrimonial member updated:',
        updatedUser.id,
      );


      // -----------------------------------------------------
      // GET UPDATED MEMBER
      // -----------------------------------------------------

      const updatedMember =
        await this.memberRepository.findOne({

          where: {
            member_id:
              updatedUser.member_id,
          },

        });


      // =====================================================
      // RETURN UPDATED DATA
      // =====================================================

      return {

        success: true,

        message:
          'Matrimonial member updated successfully',

        data: {

          ...updatedUser,


          // -------------------------------------------------
          // MEMBER DETAILS
          // -------------------------------------------------

          full_name:
            updatedMember?.full_name || null,

          name:
            updatedMember?.full_name || null,

          mobile:
            updatedMember?.mobile || null,

          email:
            updatedMember?.email || null,

          gender:
            updatedMember?.gender || null,

          occupation:
            updatedMember?.occupation || null,

          date_of_birth:
            updatedMember?.date_of_birth || null,

          photo:
            updatedMember?.photo || null,


          // -------------------------------------------------
          // LOCATION
          // -------------------------------------------------

          district:
            updatedMember?.district || null,

          mandal:
            updatedMember?.mandal || null,

          sangham:
            updatedMember?.sangham || null,
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



  // =========================================================
  // DELETE
  // =========================================================

  async remove(id: number) {

    const member =
      await this.userRepository.findOne({

        where: {
          id,
        },

      });


    if (!member) {

      throw new NotFoundException(
        `Matrimonial member with ID ${id} not found`,
      );
    }


    await this.userRepository.remove(
      member,
    );


    return {

      message:
        'Matrimonial profile deleted successfully',

      id,
    };
  }

}