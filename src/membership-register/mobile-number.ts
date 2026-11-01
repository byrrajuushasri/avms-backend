import { BadRequestException } from '@nestjs/common';

export function normalizeMembershipMobileNumber(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new BadRequestException('Mobile number is required.');
  }

  const mobile = value.trim().replace(/[\s().-]/g, '');

  if (mobile.startsWith('+91')) {
    const indianMobile = mobile.slice(3);
    if (/^[6-9]\d{9}$/.test(indianMobile)) {
      return indianMobile;
    }

    throw new BadRequestException(
      'Please enter a valid 10-digit Indian mobile number.',
    );
  }

  if (mobile.startsWith('91') && mobile.length === 12) {
    const indianMobile = mobile.slice(2);
    if (/^[6-9]\d{9}$/.test(indianMobile)) {
      return indianMobile;
    }

    throw new BadRequestException(
      'Please enter a valid 10-digit Indian mobile number.',
    );
  }

  if (/^[6-9]\d{9}$/.test(mobile)) {
    return mobile;
  }

  if (/^\+[1-9]\d{6,14}$/.test(mobile)) {
    return mobile;
  }

  throw new BadRequestException(
    'Please enter a valid mobile number with its country calling code.',
  );
}
