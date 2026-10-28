import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { MembershipRegister } from '../membership-register/entities/membership-register.entity';
import { MatrimonialUser } from './entities/matrimonial-user.entity';
import { MatrimonialUsersService } from './matrimonial-users.service';

describe('MatrimonialUsersService.findAll', () => {
  const createService = (
    members: Array<{
      member_id: string;
      gender: string;
      mobile?: string;
      email?: string;
    }> = [],
  ) => {
    const profiles = [
      {
        id: 1,
        member_id: 'male-member',
        password: 'hashed-password',
        preference_phone: '9000000001',
        created_at: new Date(),
      },
      {
        id: 2,
        member_id: 'female-member',
        password: 'hashed-password',
        preference_phone: '9000000002',
        created_at: new Date(),
      },
    ];
    const userRepository = {
      find: jest.fn().mockResolvedValue(profiles),
      findOne: jest.fn(),
    };
    const memberRepository = {
      findOne: jest.fn(({ where }: { where: { member_id: string } }) =>
        Promise.resolve(
          members.find((member) => member.member_id === where.member_id) ??
            null,
        ),
      ),
    };
    const service = new MatrimonialUsersService(
      userRepository as unknown as Repository<MatrimonialUser>,
      memberRepository as unknown as Repository<MembershipRegister>,
      {} as EmailService,
    );

    return { service, userRepository };
  };

  it.each([
    ['female', 'female-member', 'Male'],
    ['male', 'male-member', 'Female'],
  ])(
    'filters %s members to opposite-gender profiles',
    async (_description, memberId, expectedGender) => {
      const { service } = createService([
        { member_id: 'female-member', gender: 'Female' },
        { member_id: 'male-member', gender: 'Male' },
      ]);

      const result = await service.findAll({
        account_type: 'member',
        member_id: memberId,
      });

      expect(result).toHaveLength(1);
      expect(result[0].gender).toBe(expectedGender);
    },
  );

  it('does not return all profiles when the caller gender cannot be resolved', async () => {
    const { service, userRepository } = createService();

    await expect(service.findAll({ account_type: 'member' })).rejects.toThrow(
      ForbiddenException,
    );
    expect(userRepository.find).not.toHaveBeenCalled();
  });

  it('filters using gender from the login token', async () => {
    const { service } = createService([
      { member_id: 'female-member', gender: 'Female' },
      { member_id: 'male-member', gender: 'Male' },
    ]);

    const result = await service.findAll({ gender: 'Female' });

    expect(result).toHaveLength(1);
    expect(result[0].gender).toBe('Male');
  });

  it('does not expose contact details or private credentials', async () => {
    const { service } = createService([
      {
        member_id: 'female-member',
        gender: 'Female',
        mobile: '9876543210',
        email: 'private@example.com',
      },
      {
        member_id: 'male-member',
        gender: 'Male',
        mobile: '9876543211',
        email: 'owner@example.com',
      },
    ]);

    const profiles = await service.findAll({ gender: 'Female' });

    expect(profiles[0]).not.toHaveProperty('mobile');
    expect(profiles[0]).not.toHaveProperty('email');
    expect(profiles[0]).not.toHaveProperty('password');
    expect(profiles[0]).not.toHaveProperty('preference_phone');
  });

  it('does not expose private fields for a single profile', async () => {
    const { service, userRepository } = createService([
      {
        member_id: 'male-member',
        gender: 'Male',
        mobile: '9876543211',
        email: 'private@example.com',
      },
    ]);
    userRepository.findOne.mockResolvedValue({
      id: 1,
      member_id: 'male-member',
      password: 'hashed-password',
      preference_phone: '9000000001',
    });

    const profile = await service.findOne(1);

    expect(profile).not.toHaveProperty('mobile');
    expect(profile).not.toHaveProperty('email');
    expect(profile).not.toHaveProperty('password');
    expect(profile).not.toHaveProperty('preference_phone');
  });

  it('finds a profile by member ID', async () => {
    const { service, userRepository } = createService([
      { member_id: 'male-member', gender: 'Male' },
    ]);
    userRepository.findOne.mockImplementation(
      async ({ where }: { where: { id?: number; member_id?: string } }) =>
        where.member_id === 'male-member'
          ? {
              id: 1,
              member_id: 'male-member',
              password: 'hashed-password',
              preference_phone: '9000000001',
            }
          : null,
    );

    const profile = await service.findOne('male-member');

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { member_id: 'male-member' },
    });
    expect(profile?.id).toBe(1);
    expect(profile).not.toHaveProperty('password');
    expect(profile).not.toHaveProperty('preference_phone');
  });
});
