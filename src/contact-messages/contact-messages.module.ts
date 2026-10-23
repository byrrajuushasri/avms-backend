import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { ContactMessagesController } from './contact-messages.controller';
import { ContactMessagesService } from './contact-messages.service';
import { ContactMessage } from './entities/contact-message.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ContactMessage]),
    AuthModule,
    EmailModule,
  ],
  controllers: [ContactMessagesController],
  providers: [ContactMessagesService, JwtAuthGuard, RolesGuard],
})
export class ContactMessagesModule {}
