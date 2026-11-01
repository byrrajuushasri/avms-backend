import { BadRequestException } from '@nestjs/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function normalizeMembershipMobileNumber(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new BadRequestException('Mobile number is required.');
  }

  const mobile = value.trim().replace(/[\s().-]/g, '');

  if (/^[6-9]\d{9}$/.test(mobile)) {
    return mobile;
  }

  const internationalNumber =
    mobile.startsWith('91') && mobile.length === 12
      ? `+${mobile}`
      : mobile.startsWith('+')
        ? mobile
        : '';
  const parsedNumber = internationalNumber
    ? parsePhoneNumberFromString(internationalNumber)
    : undefined;

  if (parsedNumber?.isValid()) {
    if (parsedNumber.country === 'IN') {
      if (/^[6-9]\d{9}$/.test(parsedNumber.nationalNumber)) {
        return parsedNumber.nationalNumber;
      }

      throw new BadRequestException(
        'Please enter a valid 10-digit Indian mobile number.',
      );
    }

    return parsedNumber.number;
  }

  throw new BadRequestException(
    'Please enter a valid mobile number with its country calling code.',
  );
}
