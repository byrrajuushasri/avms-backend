
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly resend = new Resend(
    process.env.RESEND_API_KEY,
  );

  async sendMatrimonyRegistrationEmail(params: {
    email: string;
    name: string;
    memberId: string;
    matrimonialId: number;
    registrationDate: Date;
    expiryDate: Date;
  }) {
    const {
      email,
      name,
      memberId,
      matrimonialId,
      registrationDate,
      expiryDate,
    } = params;

    // =========================================================
    // EMAIL CHECK
    // =========================================================

    if (!email) {
      this.logger.warn(
        'Matrimony email not sent: email address is missing.',
      );

      return {
        success: false,
        message: 'Email address is missing',
      };
    }

    // =========================================================
    // RESEND FROM EMAIL
    // =========================================================

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      'noreply@aaryavysyamahasabha.com';

    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };

    const formattedRegistrationDate =
      formatDate(registrationDate);

    const formattedExpiryDate =
      formatDate(expiryDate);

    // =========================================================
    // EMAIL TEXT
    // =========================================================

    const emailText = `
Aarya Vysya Matrimony

MATRIMONIAL REGISTRATION

REGISTRATION APPROVED SUCCESSFULLY

Dear ${name || 'Member'},

Congratulations!

Your matrimonial profile has been successfully approved by the Telangana State Arya Vysya Mahasabha.

Your matrimonial registration details are:

Membership ID: ${memberId}
Matrimonial ID: ${matrimonialId}
Registration Date: ${formattedRegistrationDate}
Expiry Date: ${formattedExpiryDate}

FREE REGISTRATION

Your matrimonial registration is FREE and valid for up to 99 days from the approval/registration date.

EXTENSION

The registration can be extended for another 180 days with a volunteer contribution in three digits, as applicable.

Please keep your Membership ID and Matrimonial ID safely for future reference.

Thank you for registering with Aarya Vysya Matrimony.

Regards,

Telangana State Arya Vysya Mahasabha
Aarya Vysya Matrimony
Hyderabad, Telangana
    `.trim();

    // =========================================================
    // SEND EMAIL
    // =========================================================

    try {
      const result =
        await this.resend.emails.send({
          from:
            `Aarya Vysya Matrimony <${fromEmail}>`,

          to: [email],

          replyTo: fromEmail,

          subject:
            'Matrimony Registration Approved - Aarya Vysya Matrimony',

          text: emailText,
        });

      this.logger.log(
        `Matrimony approval email sent successfully to ${email}`,
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send matrimony approval email to ${email}`,
        error,
      );

      return {
        success: false,
        message: 'Email sending failed',
      };
    }
  }
}

