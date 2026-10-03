import { Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}