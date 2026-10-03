import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly emailService: EmailService,
  ) {}

  /**
   * Check Resend configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      if (!process.env.RESEND_API_KEY) {
        this.logger.error('RESEND_API_KEY is not configured');
        return false;
      }

      if (!process.env.RESEND_FROM_EMAIL) {
        this.logger.error('RESEND_FROM_EMAIL is not configured');
        return false;
      }

      this.logger.log('Resend email configuration is available');

      return true;
    } catch (error) {
      this.logger.error(
        'Resend email configuration check failed',
        error?.message || error,
      );

      return false;
    }
  }

  /**
   * Membership registration email is intentionally disabled.
   *
   * Requirement:
   * Membership Registration -> NO EMAIL
   * Matrimony Registration -> EMAIL
   */
  async sendMemberRegistrationEmail(): Promise<void> {
    this.logger.log(
      'Membership registration email is disabled. No email will be sent.',
    );

    return;
  }
}