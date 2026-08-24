import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  InjectRepository,
} from "@nestjs/typeorm";

import {
  Repository,
} from "typeorm";

import * as bcrypt from "bcrypt";

import {
  MatrimonialUser,
} from "./entities/matrimonial-user.entity";

import {
  Member,
} from "../members/entity/member.entity";

@Injectable()
export class MatrimonialUsersService {
  constructor(
    @InjectRepository(MatrimonialUser)
    private readonly userRepository: Repository<MatrimonialUser>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // =====================================================
  // CHECK MEMBER BEFORE MATRIMONIAL REGISTRATION
  // =====================================================

  async checkMember(data: any) {
    console.log(
      "========== CHECK MEMBER BEFORE MATRIMONIAL ==========",
    );

    const mobile =
      data?.mobile !== undefined &&
      data?.mobile !== null
        ? String(data.mobile).trim()
        : "";

    const email =
      data?.email !== undefined &&
      data?.email !== null
        ? String(data.email).trim().toLowerCase()
        : "";

    console.log("Mobile:", mobile);
    console.log("Email:", email);

    // -----------------------------------------------------
    // MOBILE / EMAIL REQUIRED
    // -----------------------------------------------------

    if (!mobile && !email) {
      return {
        success: false,
        canRegister: false,
        message:
          "Please enter Mobile Number or Email.",
      };
    }

    // -----------------------------------------------------
    // MEMBER SEARCH
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // MEMBER NOT FOUND
    // -----------------------------------------------------

    if (!member) {
      return {
        success: false,
        canRegister: false,
        message:
          "Please register as a member first. Then you can register for Matrimonial.",
      };
    }

    console.log(
      "Member found:",
      member.member_id,
    );

    // -----------------------------------------------------
    // CHECK ALREADY MATRIMONIAL REGISTERED
    // -----------------------------------------------------

    const matrimonialConditions: any[] = [];

    if (mobile) {
      matrimonialConditions.push({
        mobile,
      });
    }

    if (email) {
      matrimonialConditions.push({
        email,
      });
    }

    const existingMatrimonial =
      await this.userRepository.findOne({
        where: matrimonialConditions,
      });

    // -----------------------------------------------------
    // ALREADY REGISTERED
    // -----------------------------------------------------

    if (existingMatrimonial) {
      return {
        success: false,
        canRegister: false,
        alreadyRegistered: true,

        message:
          "This Member is already registered in Matrimonial.",

        data: {
          member_id:
            member.member_id,

          matrimonial_member_id:
            existingMatrimonial.member_id,

          full_name:
            member.full_name,

          mobile:
            member.mobile,

          email:
            member.email,

          gender:
            member.gender,
        },
      };
    }

    // -----------------------------------------------------
    // VERIFIED
    // -----------------------------------------------------

    return {
      success: true,
      canRegister: true,
      alreadyRegistered: false,

      message:
        "Member verified. You can register for Matrimonial.",

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
      "========== MATRIMONIAL REGISTER ==========",
    );

    console.log(
      "Received matrimonial data:",
      data,
    );

    console.log(
      "Received photo:",
      photo?.filename || "No photo",
    );

    // ===================================================
    // MEMBER ID FROM VERIFIED MEMBERSHIP
    // ===================================================

    const memberId =
      data?.member_id
        ? String(data.member_id).trim()
        : "";

    if (!memberId) {
      return {
        success: false,
        canRegister: false,
        message:
          "Membership verification is required.",
      };
    }

    // ===================================================
    // FIND MEMBERSHIP
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
          "Membership record not found. Please verify your membership again.",
      };
    }

    console.log(
      "Verified Membership:",
      member.member_id,
    );

    console.log(
      "Member Name:",
      member.full_name,
    );

    console.log(
      "Member Mobile:",
      member.mobile,
    );

    console.log(
      "Member Email:",
      member.email,
    );

    // ===================================================
    // MOBILE FROM MEMBERSHIP
    // ===================================================

    const mobile =
      member.mobile
        ? String(member.mobile).trim()
        : "";

    // ===================================================
    // EMAIL FROM MEMBERSHIP
    // ===================================================

    const email =
      member.email
        ? String(member.email)
            .trim()
            .toLowerCase()
        : "";

    if (!mobile && !email) {
      return {
        success: false,
        canRegister: false,
        message:
          "Membership does not contain Mobile Number or Email.",
      };
    }

    // ===================================================
    // CHECK EXISTING MATRIMONIAL PROFILE
    // ===================================================

    const matrimonialConditions: any[] = [];

    if (mobile) {
      matrimonialConditions.push({
        mobile,
      });
    }

    if (email) {
      matrimonialConditions.push({
        email,
      });
    }

    const existingUser =
      await this.userRepository.findOne({
        where: matrimonialConditions,
      });

    // ===================================================
    // ALREADY REGISTERED
    // ===================================================

    if (existingUser) {
      return {
        success: false,
        canRegister: false,
        alreadyRegistered: true,

        message:
          "This Member is already registered in Matrimonial.",

        data: {
          member_id:
            member.member_id,

          matrimonial_member_id:
            existingUser.member_id,

          full_name:
            member.full_name,

          mobile:
            member.mobile,

          email:
            member.email,
        },
      };
    }

    // ===================================================
    // CREATE NEW USER
    // ===================================================

    const user =
      new MatrimonialUser();

    // ===================================================
    // PROFILE CATEGORY
    // ===================================================

    user.profile_category =
      data.profile_category || "";

    // ===================================================
    // NAME
    // FROM MEMBERSHIP
    // ===================================================

    user.name =
      member.full_name || "";

    // ===================================================
    // SURNAME
    // Current UI does not ask surname
    // ===================================================

    user.surname = "";

    // ===================================================
    // FATHER NAME
    // ===================================================

    user.father_name =
      data.father_name || null;

    // ===================================================
    // MOTHER NAME
    // ===================================================

    user.mother_name =
      data.mother_name || null;

    // ===================================================
    // GOTRAM
    // ===================================================

    /*
      Current Entity has only:

      gotram

      Frontend has:

      father_gotram
      mother_gotram
      grandmother_gotram

      We store father_gotram as main gotram.
    */

    user.gotram =
      data.father_gotram ||
      data.gotram ||
      null;

    // ===================================================
    // NAKSHATRAM
    // ===================================================

    user.nakshatram =
      data.nakshatram || null;

    // ===================================================
    // PADHAM
    // ===================================================

    if (
      data.padham === "" ||
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

    // ===================================================
    // RASI
    // ===================================================

    user.rasi =
      data.rasi || null;

    // ===================================================
    // DATE OF BIRTH
    // FROM MEMBERSHIP IF AVAILABLE
    // ===================================================

    user.date_of_birth = null;

    if (
      (member as any).date_of_birth
    ) {
      const date =
        new Date(
          (member as any).date_of_birth,
        );

      if (
        !Number.isNaN(
          date.getTime(),
        )
      ) {
        user.date_of_birth =
          date;
      }
    }

    // ===================================================
    // COLOR
    // ===================================================

    user.color =
      data.color || null;

    // ===================================================
    // HEIGHT
    // ===================================================

    user.height =
      data.height || null;

    // ===================================================
    // MOBILE
    // FROM MEMBERSHIP
    // ===================================================

    user.mobile =
      mobile;

    // ===================================================
    // EMAIL
    // FROM MEMBERSHIP
    // ===================================================

    user.email =
      email;

    // ===================================================
    // PASSWORD
    // ===================================================

    /*
      Password is not displayed in the Matrimonial form.

      Entity requires password.

      Therefore create a secure random temporary
      password hash.
    */

    const temporaryPassword =
      `${member.member_id}_${Date.now()}`;

    user.password =
      await bcrypt.hash(
        temporaryPassword,
        10,
      );

    // ===================================================
    // EDUCATION
    // ===================================================

    user.education =
      data.education || null;

    // ===================================================
    // OCCUPATION
    // ===================================================

    user.occupation =
      data.occupation || null;

    // ===================================================
    // ANNUAL INCOME
    // ===================================================

    user.annual_income =
      data.annual_income || null;

    // ===================================================
    // ADDRESS
    // ===================================================

    user.address =
      data.address || null;

    // ===================================================
    // FAMILY DETAILS
    // ===================================================

    user.family_details =
      data.family_details || null;

    // ===================================================
    // BROTHER DETAILS
    // ===================================================

    user.brother_details =
      data.brother_details || null;

    // ===================================================
    // SISTER DETAILS
    // ===================================================

    user.sister_details =
      data.sister_details || null;

    // ===================================================
    // PROPERTY DETAILS
    // ===================================================

    user.property_details =
      data.property_details || null;

    // ===================================================
    // PREFERRED REQUIREMENTS
    // ===================================================

    user.preferred_requirements =
      data.preferred_requirements || null;

    // ===================================================
    // PHOTO
    // ===================================================

    if (photo) {
      user.photo =
        photo.filename;
    } else {
      user.photo = null;
    }

    // ===================================================
    // STATUS
    // ===================================================

    user.status =
      "Pending";

    // ===================================================
    // MEMBERSHIP
    // ===================================================

    user.membership =
      "Free";

    // ===================================================
    // TEMPORARY MEMBER ID
    // ===================================================

    user.member_id =
      `TEMP_${Date.now()}_${Math.floor(
        Math.random() * 10000,
      )}`;

    // ===================================================
    // SAVE
    // ===================================================

    try {
      const savedUser =
        await this.userRepository.save(
          user,
        );

      console.log(
        "Initial matrimonial record saved:",
        savedUser.id,
      );

      // =================================================
      // FINAL MATRIMONIAL ID
      // =================================================

      savedUser.member_id =
        `AVM${String(
          savedUser.id,
        ).padStart(6, "0")}`;

      const finalUser =
        await this.userRepository.save(
          savedUser,
        );

      console.log(
        "Final Matrimonial ID:",
        finalUser.member_id,
      );

      // =================================================
      // SUCCESS
      // =================================================

      return {
        success: true,

        message:
          "Matrimonial member added successfully",

        data: {
          id:
            finalUser.id,

          member_id:
            finalUser.member_id,

          member_source_id:
            member.member_id,

          name:
            finalUser.name,

          email:
            finalUser.email,

          mobile:
            finalUser.mobile,

          photo:
            finalUser.photo,

          status:
            finalUser.status,

          membership:
            finalUser.membership,
        },
      };
    } catch (error) {
      console.error(
        "========== MATRIMONIAL DATABASE ERROR ==========",
      );

      console.error(error);

      console.error(
        "=================================================",
      );

      throw error;
    }
  }

  // =====================================================
  // GET ALL MATRIMONIAL USERS
  // =====================================================

  async findAll(): Promise<MatrimonialUser[]> {
    return await this.userRepository.find({
      order: {
        created_at: "DESC",
      },
    });
  }

  // =====================================================
  // GET ONE MATRIMONIAL USER
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
  // UPDATE MATRIMONIAL USER
  // =====================================================

  async update(
    id: number,
    data: any,
    photo?: Express.Multer.File,
  ) {
    console.log(
      "========== MATRIMONIAL UPDATE ==========",
    );

    console.log(
      "Matrimonial ID:",
      id,
    );

    console.log(
      "Received update data:",
      data,
    );

    console.log(
      "New photo:",
      photo?.filename || "No new photo",
    );

    // ===================================================
    // FIND USER
    // ===================================================

    const member =
      await this.userRepository.findOne({
        where: {
          id,
        },
      });

    if (!member) {
      throw new NotFoundException(
        "Matrimonial member not found",
      );
    }

    // ===================================================
    // PROFILE CATEGORY
    // ===================================================

    member.profile_category =
      data.profile_category ??
      member.profile_category;

    // ===================================================
    // SURNAME
    // ===================================================

    member.surname =
      data.surname ??
      member.surname;

    // ===================================================
    // NAME
    // ===================================================

    member.name =
      data.name ??
      member.name;

    // ===================================================
    // FATHER
    // ===================================================

    member.father_name =
      data.father_name ??
      member.father_name;

    // ===================================================
    // MOTHER
    // ===================================================

    member.mother_name =
      data.mother_name ??
      member.mother_name;

    // ===================================================
    // GOTRAM
    // ===================================================

    member.gotram =
      data.father_gotram ??
      data.gotram ??
      member.gotram;

    // ===================================================
    // NAKSHATRAM
    // ===================================================

    member.nakshatram =
      data.nakshatram ??
      member.nakshatram;

    // ===================================================
    // PADHAM
    // ===================================================

    if (
      data.padham === "" ||
      data.padham === null ||
      data.padham === undefined
    ) {
      member.padham = null;
    } else {
      const padhamNumber =
        Number(data.padham);

      if (
        !Number.isNaN(
          padhamNumber,
        )
      ) {
        member.padham =
          padhamNumber;
      }
    }

    // ===================================================
    // RASI
    // ===================================================

    member.rasi =
      data.rasi ??
      member.rasi;

    // ===================================================
    // DATE OF BIRTH
    // ===================================================

    if (
      data.date_of_birth !==
        undefined &&
      data.date_of_birth !== null &&
      data.date_of_birth !== ""
    ) {
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

    // ===================================================
    // COLOR
    // ===================================================

    member.color =
      data.color ??
      member.color;

    // ===================================================
    // HEIGHT
    // ===================================================

    member.height =
      data.height ??
      member.height;

    // ===================================================
    // MOBILE
    // ===================================================

    if (
      data.mobile !==
      undefined
    ) {
      member.mobile =
        String(
          data.mobile,
        ).trim();
    }

    // ===================================================
    // EMAIL
    // ===================================================

    if (
      data.email !==
      undefined
    ) {
      member.email =
        String(
          data.email,
        )
          .trim()
          .toLowerCase();
    }

    // ===================================================
    // PASSWORD
    // ===================================================

    if (
      data.password &&
      typeof data.password ===
        "string" &&
      data.password.trim() !== ""
    ) {
      member.password =
        await bcrypt.hash(
          data.password.trim(),
          10,
        );
    }

    // ===================================================
    // EDUCATION
    // ===================================================

    member.education =
      data.education ??
      member.education;

    // ===================================================
    // OCCUPATION
    // ===================================================

    member.occupation =
      data.occupation ??
      member.occupation;

    // ===================================================
    // ANNUAL INCOME
    // ===================================================

    member.annual_income =
      data.annual_income ??
      member.annual_income;

    // ===================================================
    // ADDRESS
    // ===================================================

    member.address =
      data.address ??
      member.address;

    // ===================================================
    // FAMILY
    // ===================================================

    member.family_details =
      data.family_details ??
      member.family_details;

    // ===================================================
    // BROTHER
    // ===================================================

    member.brother_details =
      data.brother_details ??
      member.brother_details;

    // ===================================================
    // SISTER
    // ===================================================

    member.sister_details =
      data.sister_details ??
      member.sister_details;

    // ===================================================
    // PROPERTY
    // ===================================================

    member.property_details =
      data.property_details ??
      member.property_details;

    // ===================================================
    // PREFERRED REQUIREMENTS
    // ===================================================

    member.preferred_requirements =
      data.preferred_requirements ??
      member.preferred_requirements;

    // ===================================================
    // STATUS
    // ===================================================

    member.status =
      data.status ??
      member.status ??
      "Pending";

    // ===================================================
    // MEMBERSHIP
    // ===================================================

    member.membership =
      data.membership ??
      member.membership ??
      "Free";

    // ===================================================
    // PHOTO
    // ===================================================

    if (photo) {
      member.photo =
        photo.filename;

      console.log(
        "Photo updated:",
        photo.filename,
      );
    }

    // ===================================================
    // SAVE
    // ===================================================

    try {
      const updatedUser =
        await this.userRepository.save(
          member,
        );

      console.log(
        "Matrimonial member updated:",
        updatedUser.id,
      );

      return {
        success: true,

        message:
          "Matrimonial member updated successfully",

        data:
          updatedUser,
      };
    } catch (error) {
      console.error(
        "========== UPDATE DATABASE ERROR ==========",
      );

      console.error(error);

      console.error(
        "===========================================",
      );

      throw error;
    }
  }
}