import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { MembershipRegister } from './entities/membership-register.entity';
import { CreateMembershipRegisterDto } from './dto/create-membership-register.dto';
import { UpdateMembershipRegisterDto } from './dto/update-membership-register.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class MembershipRegisterService {
  constructor(
    @InjectRepository(MembershipRegister)
    private readonly membershipRepository: Repository<MembershipRegister>,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {}

  // =========================================================
  // VALIDATE AND NORMALIZE MOBILE NUMBER
  // DATABASE FORMAT: 10 DIGITS ONLY
  // =========================================================

  private validateMobileNumber(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException('Mobile number is required.');
    }

    let mobile = value.trim().replace(/[\s()-]/g, '');

    // +919700066123 -> 9700066123
    if (mobile.startsWith('+91')) {
      mobile = mobile.slice(3);
    } else if (mobile.startsWith('91') && mobile.length === 12) {
      // 919700066123 -> 9700066123
      mobile = mobile.slice(2);
    }

    // Validate Indian mobile number
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      throw new BadRequestException(
        'Please enter a valid 10-digit Indian mobile number.',
      );
    }

    return mobile;
  }

  // =========================================================
  // GENERATE AVS ID
  // FORMAT: AVS + STATE(2) + DISTRICT(2) + MANDAL(3) + SERIAL(3)
  // =========================================================

  private async generateAvsId(
    districtName: string,
    mandalName: string,
    executiveBody: string,
  ): Promise<string> {
    const body = (executiveBody || '').trim();
    const district = (districtName || '').trim();
    const mandal = (mandalName || '').trim();

    const stateCode = '01';

    let districtCode = '00';
    let mandalCode = '000';

    if (body === 'State Body') {
      districtCode = '00';
      mandalCode = '000';
    } else {
      if (!district) {
        throw new BadRequestException('District is required.');
      }

      const districtRows = await this.dataSource.query(
        `
        SELECT id, name, type, parent_id
        FROM locations
        WHERE type = 'district'
          AND LOWER(TRIM(name)) = LOWER(TRIM(?))
        LIMIT 1
        `,
        [district],
      );

      if (!districtRows || districtRows.length === 0) {
        throw new BadRequestException(
          `District not found in locations: ${district}`,
        );
      }

      const districtId = Number(districtRows[0].id);

      if (!Number.isInteger(districtId) || districtId < 0 || districtId > 99) {
        throw new BadRequestException(
          `District location ID ${districtId} cannot be converted to a 2-digit AVS code.`,
        );
      }

      districtCode = String(districtId).padStart(2, '0');

      if (body === 'District Body') {
        mandalCode = '000';
      } else if (body === 'Mandal Body' || body === 'Sangham Body') {
        if (!mandal) {
          throw new BadRequestException('Mandal is required.');
        }

        const mandalRows = await this.dataSource.query(
          `
          SELECT id, name, type, parent_id
          FROM locations
          WHERE type = 'mandal'
            AND parent_id = ?
            AND LOWER(TRIM(name)) = LOWER(TRIM(?))
          LIMIT 1
          `,
          [districtId, mandal],
        );

        if (!mandalRows || mandalRows.length === 0) {
          throw new BadRequestException(
            `Mandal "${mandal}" not found under district "${district}".`,
          );
        }

        const mandalId = Number(mandalRows[0].id);

        if (!Number.isInteger(mandalId) || mandalId < 0 || mandalId > 999) {
          throw new BadRequestException(
            `Mandal location ID ${mandalId} cannot be converted to a 3-digit AVS code.`,
          );
        }

        mandalCode = String(mandalId).padStart(3, '0');
      } else {
        throw new BadRequestException(`Invalid Executive Body: ${body}`);
      }
    }

    const prefix = `AVS${stateCode}${districtCode}${mandalCode}`;

    console.log('=========================================');
    console.log('GENERATING AVS ID');
    console.log('EXECUTIVE BODY:', body);
    console.log('DISTRICT:', district);
    console.log('MANDAL:', mandal);
    console.log('DISTRICT CODE:', districtCode);
    console.log('MANDAL CODE:', mandalCode);
    console.log('AVS PREFIX:', prefix);
    console.log('=========================================');

    const memberRows = await this.dataSource.query(
      `
      SELECT id, avs_id
      FROM members
      WHERE avs_id IS NOT NULL
        AND avs_id LIKE ?
      `,
      [`${prefix}%`],
    );

    let maxSerial = 0;

    for (const row of memberRows || []) {
      const existingAvsId = String(row.avs_id || '');

      if (!existingAvsId.startsWith(prefix)) {
        continue;
      }

      const serialPart = existingAvsId.slice(prefix.length);

      if (!/^\d{3}$/.test(serialPart)) {
        continue;
      }

      const serial = Number(serialPart);

      if (serial > maxSerial) {
        maxSerial = serial;
      }
    }

    const nextSerial = maxSerial + 1;

    if (nextSerial > 999) {
      throw new BadRequestException(
        `AVS ID serial limit reached for ${
          district || 'State'
        } - ${mandal || 'All Mandals'}.`,
      );
    }

    const serialCode = String(nextSerial).padStart(3, '0');
    const avsId = `${prefix}${serialCode}`;

    const duplicateAvs = await this.dataSource.query(
      `
      SELECT id
      FROM members
      WHERE avs_id = ?
      LIMIT 1
      `,
      [avsId],
    );

    if (duplicateAvs && duplicateAvs.length > 0) {
      throw new ConflictException(
        `Generated AVS ID ${avsId} already exists. Please try registration again.`,
      );
    }

    console.log('GENERATED AVS ID:', avsId);

    return avsId;
  }

  // =========================================================
  // CREATE MEMBERSHIP
  // =========================================================

  async create(dto: CreateMembershipRegisterDto, photoPath?: string) {
    // Always normalize mobile before database operations.
    const mobile = this.validateMobileNumber(dto.mobile);

    const executiveBody = dto.executive_body?.trim() || 'State Body';
    const district = dto.district?.trim() || '';
    const mandal = dto.mandal?.trim() || '';
    const sangham = dto.sangham?.trim() || '';

    if (
      ['District Body', 'Mandal Body', 'Sangham Body'].includes(
        executiveBody,
      ) &&
      !district
    ) {
      throw new BadRequestException('District is required.');
    }

    if (['Mandal Body', 'Sangham Body'].includes(executiveBody) && !mandal) {
      throw new BadRequestException('Mandal is required.');
    }

    if (executiveBody === 'Sangham Body' && !sangham) {
      throw new BadRequestException('Sangham is required.');
    }

    // EMAIL CHECK
    const email = dto.email?.trim().toLowerCase();

    if (email) {
      const existingEmail = await this.membershipRepository.findOne({
        where: { email },
      });

      if (existingEmail) {
        throw new ConflictException(
          `This email address is already registered. Member ID: ${
            existingEmail.member_id || existingEmail.id
          }`,
        );
      }
    }

    // MOBILE DUPLICATE CHECK
    const existingMobile = await this.membershipRepository.findOne({
      where: { mobile },
    });

    if (existingMobile) {
      throw new ConflictException(
        `This mobile number is already registered. Member ID: ${
          existingMobile.member_id || existingMobile.id
        }`,
      );
    }

    // CREATE MEMBER
    const member = new MembershipRegister();

    member.full_name = dto.full_name?.trim();
    member.surname = dto.surname?.trim() || null;
    member.father_name = dto.father_name?.trim() || null;
    member.location = dto.location?.trim() || null;

    // Store exactly 10 digits.
    member.mobile = mobile;

    if (email) {
      member.email = email;
    }

    // PASSWORD
    if (dto.password && dto.password.trim() !== '') {
      member.password = await bcrypt.hash(dto.password.trim(), 10);
    } else {
      member.password = null;
    }

    // OTHER DETAILS
    member.occupation = dto.occupation?.trim() || null;
    member.gender = dto.gender?.trim();
    member.date_of_birth = dto.date_of_birth;
    member.gotram = dto.gotram?.trim() || null;

    member.is_existing_mahashaba_member =
      dto.is_existing_mahashaba_member?.trim() || null;

    member.is_existing_sangam_member =
      dto.is_existing_sangam_member?.trim() || null;

    // TEMP MEMBER ID
    member.member_id = `TEMP_${Date.now()}`;

    // DEFAULT ROLE
    member.role = 'user';

    // LOCATION
    member.district = district || null;
    member.mandal = mandal || null;
    member.sangham = sangham || null;

    // EXECUTIVE BODY
    member.executive_body = executiveBody;
    member.designation = dto.designation?.trim() || 'Member';

    // GENERATE AVS ID
    const avsId = await this.generateAvsId(district, mandal, executiveBody);

    member.avs_id = avsId;

    // PHOTO
    member.photo = photoPath || null;

    // STATUS
    member.status = 'Pending';

    // MAHASHABA PAYMENT
    member.mahashaba_payment_status = null;
    member.mahashaba_payment_method = null;
    member.mahashaba_receipt_number = null;
    member.mahashaba_amount_paid = null;
    member.mahashaba_payment_date = null;

    // SANGAM PAYMENT
    member.sangam_payment_status = null;
    member.sangam_payment_method = null;
    member.sangam_receipt_number = null;
    member.sangam_amount_paid = null;
    member.sangam_payment_date = null;

    // SAVE MEMBER
    let savedMember: MembershipRegister;

    try {
      savedMember = await this.membershipRepository.save(member);
    } catch (error: any) {
      console.error('MEMBERSHIP CREATE ERROR:', error);

      if (error?.code === 'ER_DUP_ENTRY') {
        const message = String(
          error?.sqlMessage || error?.message || '',
        ).toLowerCase();

        if (message.includes('email')) {
          throw new ConflictException(
            'This email address is already registered.',
          );
        }

        if (message.includes('mobile')) {
          throw new ConflictException(
            'This mobile number is already registered.',
          );
        }

        if (message.includes('avs_id')) {
          throw new ConflictException(
            'This AVS ID already exists. Please try registration again.',
          );
        }

        throw new ConflictException('This member already exists.');
      }

      throw error;
    }

    // GENERATE TVM MEMBER ID
    const memberId = `TVM${String(savedMember.id).padStart(5, '0')}`;

    savedMember.member_id = memberId;

    // SAVE MEMBER ID
    const updatedMember = await this.membershipRepository.save(savedMember);

    // REMOVE PASSWORD
    const { password, ...safeMember } = updatedMember;

    return {
      success: true,
      message: 'Membership registered successfully',
      member_id: updatedMember.member_id,
      avs_id: updatedMember.avs_id,
      id: updatedMember.id,
      photo: updatedMember.photo,
      data: safeMember,
    };
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  async findOne(id: number) {
    const member = await this.membershipRepository.findOne({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found.`);
    }

    const { password, ...safeMember } = member;

    return safeMember;
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll(sangham?: string, role?: string) {
    console.log('=================================');
    console.log('GET MEMBERS CALLED');
    console.log('SERVICE ROLE:', role);
    console.log('SERVICE SANGHAM:', sangham);
    console.log('=================================');

    const query = this.membershipRepository
      .createQueryBuilder('member')
      .orderBy('member.id', 'DESC');

    if (role === 'super_admin' || role === 'admin' || role === 'state_admin') {
      // Full access
    } else if (role === 'sangham_admin') {
      if (!sangham) {
        return [];
      }

      query.andWhere(
        `
        LOWER(TRIM(member.sangham)) = LOWER(TRIM(:sangham))
        `,
        { sangham },
      );
    } else if (role === 'district_admin') {
      // District restriction can be added later.
    } else if (role === 'mandal_admin') {
      // Mandal restriction can be added later.
    } else {
      console.log('UNKNOWN ROLE:', role);
    }

    const members = await query.getMany();

    console.log('MEMBERS COUNT:', members.length);

    return members.map(({ password, ...member }) => member);
  }

  // =========================================================
  // PUBLIC EXECUTIVES
  // =========================================================

  async findPublicExecutives(
    district?: string,
    mandal?: string,
    sangham?: string,
  ) {
    const designations = [
      'president',
      'vice president',
      'general secretary',
      'joint secretary',
    ];

    const query = this.membershipRepository.createQueryBuilder('member').where(
      `
        LOWER(TRIM(member.designation)) IN (:...designations)
        `,
      { designations },
    );

    if (district) {
      query.andWhere(
        `
        LOWER(TRIM(member.district)) = LOWER(TRIM(:district))
        `,
        { district },
      );
    }

    if (mandal) {
      query.andWhere(
        `
        LOWER(TRIM(member.mandal)) = LOWER(TRIM(:mandal))
        `,
        { mandal },
      );
    }

    if (sangham) {
      query.andWhere(
        `
        LOWER(TRIM(member.sangham)) = LOWER(TRIM(:sangham))
        `,
        { sangham },
      );
    }

    query.orderBy('member.id', 'DESC');

    const members = await query.getMany();

    return members.map(({ password, ...member }) => member);
  }

  // =========================================================
  // UPDATE MEMBERSHIP
  // =========================================================

  async update(
    id: number,
    dto: UpdateMembershipRegisterDto,
    photoPath?: string,
  ) {
    const member = await this.membershipRepository.findOne({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found.`);
    }

    const wasApproved = String(member.status).trim().toLowerCase() === 'active';

    // BASIC DETAILS
    if (dto.full_name !== undefined) {
      member.full_name = dto.full_name?.trim();
    }

    if (dto.surname !== undefined) {
      member.surname = dto.surname?.trim() || null;
    }

    if (dto.father_name !== undefined) {
      member.father_name = dto.father_name?.trim() || null;
    }

    if (dto.location !== undefined) {
      member.location = dto.location?.trim() || null;
    }

    // EMAIL
    if (dto.email !== undefined) {
      const email = dto.email?.trim().toLowerCase();

      if (email) {
        const existingEmail = await this.membershipRepository.findOne({
          where: { email },
        });

        if (existingEmail && existingEmail.id !== id) {
          throw new ConflictException(
            'This email address is already registered.',
          );
        }

        member.email = email;
      }
    }

    // MOBILE VALIDATION AND DUPLICATE CHECK
    if (dto.mobile !== undefined) {
      const mobile = this.validateMobileNumber(dto.mobile);

      const existingMobile = await this.membershipRepository.findOne({
        where: { mobile },
      });

      if (existingMobile && existingMobile.id !== id) {
        throw new ConflictException(
          'This mobile number is already registered.',
        );
      }

      member.mobile = mobile;
    }

    // OTHER DETAILS
    if (dto.occupation !== undefined) {
      member.occupation = dto.occupation?.trim() || null;
    }

    if (dto.gender !== undefined) {
      member.gender = dto.gender?.trim();
    }

    if (dto.date_of_birth !== undefined) {
      member.date_of_birth = dto.date_of_birth;
    }

    if (dto.gotram !== undefined) {
      member.gotram = dto.gotram?.trim() || null;
    }

    if (dto.is_existing_mahashaba_member !== undefined) {
      member.is_existing_mahashaba_member =
        dto.is_existing_mahashaba_member?.trim() || null;
    }

    if (dto.is_existing_sangam_member !== undefined) {
      member.is_existing_sangam_member =
        dto.is_existing_sangam_member?.trim() || null;
    }

    // ROLE
    if (dto.role !== undefined) {
      member.role = dto.role?.trim();
    }

    // STATUS
    if (dto.status !== undefined) {
      member.status = dto.status?.trim();
    }

    // PASSWORD
    if (dto.password && dto.password.trim() !== '') {
      member.password = await bcrypt.hash(dto.password.trim(), 10);
    }

    // DISTRICT
    if (dto.district !== undefined) {
      member.district = dto.district?.trim() || null;
    }

    // MANDAL
    if (dto.mandal !== undefined) {
      member.mandal = dto.mandal?.trim() || null;
    }

    // SANGHAM
    if (dto.sangham !== undefined) {
      member.sangham = dto.sangham?.trim() || null;
    }

    // AVS ID remains permanent during updates.

    // EXECUTIVE BODY
    if (dto.executive_body !== undefined) {
      member.executive_body = dto.executive_body?.trim() || null;
    }

    // DESIGNATION
    if (dto.designation !== undefined) {
      member.designation = dto.designation?.trim() || null;
    }

    // MAHASHABA PAYMENT
    if (dto.mahashaba_payment_status !== undefined) {
      member.mahashaba_payment_status = dto.mahashaba_payment_status;
    }

    if (dto.mahashaba_payment_method !== undefined) {
      member.mahashaba_payment_method = dto.mahashaba_payment_method;
    }

    if (dto.mahashaba_receipt_number !== undefined) {
      member.mahashaba_receipt_number = dto.mahashaba_receipt_number;
    }

    if (dto.mahashaba_amount_paid !== undefined) {
      member.mahashaba_amount_paid = dto.mahashaba_amount_paid;
    }

    if (dto.mahashaba_payment_date !== undefined) {
      member.mahashaba_payment_date = dto.mahashaba_payment_date;
    }

    // SANGAM PAYMENT
    if (dto.sangam_payment_status !== undefined) {
      member.sangam_payment_status = dto.sangam_payment_status;
    }

    if (dto.sangam_payment_method !== undefined) {
      member.sangam_payment_method = dto.sangam_payment_method;
    }

    if (dto.sangam_receipt_number !== undefined) {
      member.sangam_receipt_number = dto.sangam_receipt_number;
    }

    if (dto.sangam_amount_paid !== undefined) {
      member.sangam_amount_paid = dto.sangam_amount_paid;
    }

    if (dto.sangam_payment_date !== undefined) {
      member.sangam_payment_date = dto.sangam_payment_date;
    }

    // PHOTO
    if (photoPath) {
      member.photo = photoPath;
    }

    // SAVE
    try {
      const updated = await this.membershipRepository.save(member);
      const isApproved =
        String(updated.status).trim().toLowerCase() === 'active';
      let emailSent: boolean | undefined;

      if (!wasApproved && isApproved) {
        emailSent = updated.email
          ? await this.emailService.sendMembershipApprovalEmail({
              email: updated.email,
              name: updated.full_name || 'Member',
              memberId: updated.member_id,
            })
          : false;
      }

      const { password, ...safeMember } = updated;

      return {
        success: true,
        message:
          emailSent === undefined
            ? 'Membership updated successfully'
            : emailSent
              ? 'Membership approved and email sent successfully'
              : 'Membership approved, but email could not be sent',
        ...(emailSent !== undefined ? { email_sent: emailSent } : {}),
        data: safeMember,
      };
    } catch (error: any) {
      console.error('MEMBERSHIP UPDATE ERROR:', error);

      if (error?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Duplicate member information already exists.',
        );
      }

      throw error;
    }
  }

  // =========================================================
  // DELETE MEMBERSHIP
  // =========================================================

  async remove(id: number) {
    const member = await this.membershipRepository.findOne({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found.`);
    }

    await this.membershipRepository.remove(member);

    return {
      success: true,
      message: 'Membership deleted successfully',
    };
  }
}
