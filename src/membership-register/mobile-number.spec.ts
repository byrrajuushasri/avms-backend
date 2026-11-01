import { BadRequestException } from '@nestjs/common';
import { normalizeMembershipMobileNumber } from './mobile-number';

describe('normalizeMembershipMobileNumber', () => {
  it('keeps Indian numbers in the existing 10-digit format', () => {
    expect(normalizeMembershipMobileNumber('9876543210')).toBe('9876543210');
    expect(normalizeMembershipMobileNumber('+91 98765-43210')).toBe(
      '9876543210',
    );
  });

  it('accepts and normalizes international E.164 numbers', () => {
    expect(normalizeMembershipMobileNumber('+44 (20) 7946-0958')).toBe(
      '+442079460958',
    );
    expect(normalizeMembershipMobileNumber('+1 202 555 0123')).toBe(
      '+12025550123',
    );
  });

  it('rejects invalid numbers and international numbers without a country code', () => {
    expect(() => normalizeMembershipMobileNumber('2025550123')).toThrow(
      BadRequestException,
    );
    expect(() => normalizeMembershipMobileNumber('+91 12345 67890')).toThrow(
      BadRequestException,
    );
    expect(() => normalizeMembershipMobileNumber('+121653414')).toThrow(
      BadRequestException,
    );
    expect(() => normalizeMembershipMobileNumber('+123')).toThrow(
      BadRequestException,
    );
  });
});
