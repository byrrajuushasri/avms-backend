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
  }) {
    const {
      email,
      name,
      memberId,
      matrimonialId,
    } = params;

    if (!email) {
      this.logger.warn(
        'Matrimony email not sent: email address is missing.',
      );

      return {
        success: false,
        message: 'Email address is missing',
      };
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      'noreply@aaryavysyamahasabha.com';

    // Registration date
    const registrationDate = new Date();

    // Free registration = 99 days
    const expiryDate = new Date(registrationDate);

    expiryDate.setDate(
      expiryDate.getDate() + 99,
    );

    // Format date
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };

    const formattedRegistrationDate =
      formatDate(registrationDate);

    const formattedExpiryDate =
      formatDate(expiryDate);

    try {
      const result =
        await this.resend.emails.send({
          from:
            `Aarya Vysya Matrimony <${fromEmail}>`,

          to: [email],

          replyTo: fromEmail,

          subject:
            'Matrimony Registration Successful - Aarya Vysya Matrimony',

          text: `
Aarya Vysya Matrimony

Matrimonial Registration

Registration Successful

Dear ${name || 'Member'},

Your matrimonial profile has been successfully registered with Aarya Vysya Matrimony.

Membership ID: ${memberId}
Matrimonial ID: ${matrimonialId}
Registration Date: ${formattedRegistrationDate}
Expiry Date: ${formattedExpiryDate}

FREE REGISTRATION

Registration is free and valid for up to 99 days.

Registration may be extended by 180 days with volunteer contribution in three digits.

Thank you for registering with Aarya Vysya Matrimony.

Aarya Vysya Matrimony
          `.trim(),
        });

      this.logger.log(
        `Matrimony registration email sent to ${email}`,
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send matrimony email to ${email}`,
        error,
      );

      return {
        success: false,
        message: 'Email sending failed',
      };
    }
  }
}