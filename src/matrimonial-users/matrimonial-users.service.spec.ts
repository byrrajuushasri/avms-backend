import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { MembershipRegister } from '../membership-register/entities/membership-register.entity';
import { MatrimonialInterestRequest } from './entities/matrimonial-interest-request.entity';
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
    const interestRequestRepository = {
      create: jest.fn((request) => request),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const service = new MatrimonialUsersService(
      userRepository as unknown as Repository<MatrimonialUser>,
      memberRepository as unknown as Repository<MembershipRegister>,
      interestRequestRepository as unknown as Repository<MatrimonialInterestRequest>,
      {} as EmailService,
    );

    return {
      service,
      userRepository,
      memberRepository,
      interestRequestRepository,
    };
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
    const { service, userRepository, memberRepository } = createService();

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

  it('exposes contact details to the profile owner', async () => {
    const { service, userRepository, memberRepository } = createService();
    userRepository.findOne.mockResolvedValue({
      id: 2,
      member_id: 'female-member',
      password: 'hashed-password',
    });
    memberRepository.findOne.mockResolvedValue({
      member_id: 'female-member',
      mobile: '9876543210',
      email: 'profile@example.com',
    });

    const profile = await service.findOne(2, {
      account_type: 'matrimonial',
      matrimonial_id: 2,
    });

    expect(profile).toMatchObject({
      email: 'profile@example.com',
      mobile: '9876543210',
    });
  });

  it('exposes contact details to an accepted connection only', async () => {
    const {
      service,
      userRepository,
      memberRepository,
      interestRequestRepository,
    } = createService();
    userRepository.findOne.mockResolvedValue({
      id: 2,
      member_id: 'female-member',
      password: 'hashed-password',
    });
    memberRepository.findOne.mockResolvedValue({
      member_id: 'female-member',
      mobile: '9876543210',
      email: 'profile@example.com',
    });
    interestRequestRepository.findOne.mockResolvedValue({
      id: 25,
      sender_profile_id: 1,
      recipient_profile_id: 2,
      status: 'Accepted',
    });

    const profile = await service.findOne(2, {
      account_type: 'matrimonial',
      matrimonial_id: 1,
    });

    expect(profile).toMatchObject({
      email: 'profile@example.com',
      mobile: '9876543210',
    });
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

  it('creates a pending request from the authenticated profile', async () => {
    const { service, userRepository, interestRequestRepository } =
      createService();
    userRepository.findOne.mockImplementation(
      async ({ where }: { where: { id?: number } }) =>
        where.id === 1 ? { id: 1, member_id: 'male-member' } : { id: 2 },
    );
    interestRequestRepository.findOne.mockResolvedValue(null);
    interestRequestRepository.save.mockImplementation(async (request) => ({
      id: 25,
      ...request,
    }));

    const result = await service.sendInterestRequest(2, {
      account_type: 'matrimonial',
      matrimonial_id: 1,
    });

    expect(interestRequestRepository.create).toHaveBeenCalledWith({
      sender_profile_id: 1,
      recipient_profile_id: 2,
      status: 'Pending',
    });
    expect(result.request).toMatchObject({
      id: 25,
      sender_profile_id: 1,
      recipient_profile_id: 2,
      status: 'Pending',
    });
  });

  it('allows only the recipient to accept a request and returns the sender profile', async () => {
    const { service, userRepository, interestRequestRepository } =
      createService([{ member_id: 'male-member', gender: 'Male' }]);
    const request = {
      id: 25,
      sender_profile_id: 1,
      recipient_profile_id: 2,
      status: 'Pending',
      created_at: new Date(),
    };
    userRepository.findOne.mockImplementation(
      async ({ where }: { where: { id?: number } }) =>
        where.id === 2
          ? { id: 2, member_id: 'female-member' }
          : { id: 1, member_id: 'male-member', password: 'secret' },
    );
    interestRequestRepository.findOne.mockResolvedValue(request);
    interestRequestRepository.save.mockImplementation(async (saved) => saved);

    const result = await service.acceptInterestRequest(25, {
      account_type: 'matrimonial',
      matrimonial_id: 2,
    });

    expect(request.status).toBe('Accepted');
    expect(interestRequestRepository.save).toHaveBeenCalledWith(request);
    expect(result.profile).toMatchObject({ id: 1 });
    expect(result.profile).not.toHaveProperty('password');
  });

  it('returns incoming request totals and the pending count', async () => {
    const { service, userRepository, interestRequestRepository } =
      createService();
    userRepository.findOne.mockResolvedValue({ id: 2 });
    interestRequestRepository.find.mockResolvedValue([
      {
        id: 25,
        sender_profile_id: 1,
        recipient_profile_id: 2,
        status: 'Pending',
        created_at: new Date(),
      },
      {
        id: 26,
        sender_profile_id: 3,
        recipient_profile_id: 2,
        status: 'Accepted',
        created_at: new Date(),
      },
    ]);
    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue({ id: 1 } as MatrimonialUser);

    const result = await service.getReceivedRequests({
      account_type: 'matrimonial',
      matrimonial_id: 2,
    });

    expect(result.counts).toEqual({
      likes: 2,
      requests: 1,
      accepted: 1,
    });
    expect(result.requests).toHaveLength(2);
    expect(result.requests[0].profile).toMatchObject({ id: 1 });
  });

  it('prevents a non-recipient from accepting an interest request', async () => {
    const { service, userRepository, interestRequestRepository } =
      createService();
    userRepository.findOne.mockResolvedValue({ id: 3 });
    interestRequestRepository.findOne.mockResolvedValue({
      id: 25,
      sender_profile_id: 1,
      recipient_profile_id: 2,
      status: 'Pending',
    });

    await expect(
      service.acceptInterestRequest(25, {
        account_type: 'matrimonial',
        matrimonial_id: 3,
      }),
    ).rejects.toThrow(ForbiddenException);
    expect(interestRequestRepository.save).not.toHaveBeenCalled();
  });
});
