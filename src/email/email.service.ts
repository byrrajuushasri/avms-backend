import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendPasswordResetEmail(params: {
    email: string;
    name: string;
    resetUrl: string;
  }): Promise<boolean> {
    const { email, name, resetUrl } = params;
    const safeResetUrl = this.escapeHtml(resetUrl);

    return this.sendEmail(
      email,
      'Reset Your Password - Telangana State Arya Vysya Mahasabha',
      `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333;line-height:1.6">
          <h2 style="color:#800018">Telangana State Arya Vysya Mahasabha</h2>
          <p>Dear ${this.escapeHtml(name)},</p>
          <p>We received a request to reset the password for your account.</p>
          <p><a href="${safeResetUrl}" style="display:inline-block;padding:12px 20px;background:#800018;color:#fff;text-decoration:none;border-radius:8px">Reset Password</a></p>
          <p>This link expires in 30 minutes and can only be used once. If you did not request a password reset, you can ignore this email.</p>
          <p>If the button does not work, copy and paste this link into your browser:<br /><a href="${safeResetUrl}">${safeResetUrl}</a></p>
          <p>Regards,<br /><strong>Telangana State Arya Vysya Mahasabha</strong></p>
        </div>
      `,
      'Password reset',
    );
  }

  async sendMembershipApprovalEmail(params: {
    email: string;
    name: string;
    memberId: string;
  }): Promise<boolean> {
    const { email, name, memberId } = params;

    return this.sendEmail(
      email,
      'Membership Approved - Telangana State Arya Vysya Mahasabha',
      `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333;line-height:1.6">
          <h2 style="color:#800018">Telangana State Arya Vysya Mahasabha</h2>
          <p>Dear ${this.escapeHtml(name)},</p>
          <p>Your membership has been approved. You can now register for Matrimony using your registered mobile number.</p>
          <p><strong>Membership ID:</strong> ${this.escapeHtml(memberId)}</p>
          <p>Visit the Matrimony section of our website to complete your profile.</p>
          <p>Regards,<br /><strong>Telangana State Arya Vysya Mahasabha</strong></p>
        </div>
      `,
      'Membership approval',
    );
  }

  async sendMatrimonySubmissionEmail(params: {
    email: string;
    name: string;
    memberId: string;
    matrimonialId: number;
  }): Promise<boolean> {
    const { email, name, memberId, matrimonialId } = params;

    return this.sendEmail(
      email,
      'Matrimony Registration Received - Telangana State Arya Vysya Mahasabha',
      `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333;line-height:1.6">
          <h2 style="color:#800018">Telangana State Arya Vysya Mahasabha</h2>
          <p>Dear ${this.escapeHtml(name)},</p>
          <p>We have received your matrimonial registration. It is pending administrator approval. We will notify you when it has been reviewed.</p>
          <p>After approval, sign in with the email address and password you provided during registration to view your profile and search approved profiles.</p>
          <p><strong>Membership ID:</strong> ${this.escapeHtml(memberId)}</p>
          <p><strong>Matrimonial ID:</strong> ${matrimonialId}</p>
          <p>Regards,<br /><strong>Telangana State Arya Vysya Mahasabha</strong></p>
        </div>
      `,
      'Matrimony registration receipt',
    );
  }

  async sendContactReplyEmail(params: {
    email: string;
    name: string;
    subject: string;
    reply: string;
  }): Promise<boolean> {
    const { email, name, subject, reply } = params;

    return this.sendEmail(
      email,
      `Re: ${subject}`,
      `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333;line-height:1.6">
          <h2 style="color:#800018">Telangana State Arya Vysya Mahasabha</h2>
          <p>Dear ${this.escapeHtml(name)},</p>
          <p>Our team has responded to your contact message:</p>
          <p><strong>${this.escapeHtml(subject)}</strong></p>
          <div style="white-space:pre-wrap">${this.escapeHtml(reply)}</div>
          <p>Regards,<br /><strong>Telangana State Arya Vysya Mahasabha</strong></p>
        </div>
      `,
      'Contact reply',
    );
  }

  async sendMatrimonyRegistrationEmail(params: {
    email: string;
    name: string;
    memberId: string;
    matrimonialId: number;
    registrationDate: Date;
    expiryDate: Date;
  }): Promise<boolean> {
    try {
      const {
        email,
        name,
        memberId,
        matrimonialId,
        registrationDate,
        expiryDate,
      } = params;

      const formatDate = (date: Date): string =>
        new Date(date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Kolkata',
        });

      const { data, error } = await this.resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL || 'noreply@aaryavysyamahasabha.com',
        to: [email],
        subject:
          'Matrimony Registration Approved - Telangana State Arya Vysya Mahasabha',
        html: `
          <div style="font-family:Arial,sans-serif;color:#333;line-height:1.6">
            <h2 style="color:#800018">
              Telangana State Arya Vysya Mahasabha
            </h2>

            <p>Dear ${this.escapeHtml(name)},</p>

            <p style="color:#16803c">
              Congratulations! Your matrimony registration has been
              approved by the administrator.
            </p>
            <p>
              You can now sign in with the email address and password you
              provided during registration to view your profile and search
              approved profiles.
            </p>

            <h3 style="color:#800018">Registration Details</h3>
            <p><strong style="color:#800018">Name:</strong> ${this.escapeHtml(name)}</p>
            <p><strong style="color:#800018">Membership ID:</strong> ${this.escapeHtml(memberId)}</p>
            <p><strong style="color:#800018">Matrimonial ID:</strong> ${matrimonialId}</p>
            <p><strong style="color:#800018">Registration Date:</strong> ${formatDate(registrationDate)}</p>
            <p><strong style="color:#800018">Expiry Date:</strong> ${formatDate(expiryDate)}</p>
            <p><strong style="color:#800018">Registration Type:</strong> FREE REGISTRATION</p>
            <p><strong style="color:#800018">Validity:</strong> 99 days</p>

            <p>
              Your free registration is valid for 99 days.
              An extension of 180 days may be available with
              volunteer contribution, subject to the applicable
              Mahasabha rules.
            </p>

            <p>Thank you for registering with us.</p>

            <p>
              Regards,<br />
              <strong>Telangana State Arya Vysya Mahasabha</strong>
            </p>
          </div>
        `,
      });

      if (error) {
        this.logger.error(`Matrimony approval email failed: ${error.message}`);
        return false;
      }

      this.logger.log(
        `Matrimony approval email sent to ${email}. ID: ${data?.id}`,
      );
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`Failed to send matrimony approval email: ${message}`);
      return false;
    }
  }

  private async sendEmail(
    email: string,
    subject: string,
    html: string,
    context: string,
  ): Promise<boolean> {
    try {
      const { data, error } = await this.resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL || 'noreply@aaryavysyamahasabha.com',
        to: [email],
        subject,
        html,
      });

      if (error) {
        this.logger.error(`${context} email failed: ${error.message}`);
        return false;
      }

      this.logger.log(`${context} email sent to ${email}. ID: ${data?.id}`);
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Failed to send ${context.toLowerCase()} email: ${message}`,
      );
      return false;
    }
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };

      return entities[character];
    });
  }
}
