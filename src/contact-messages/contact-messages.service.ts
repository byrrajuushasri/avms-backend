import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { EmailService } from '../email/email.service';
import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactMessagesService {
  private readonly logger = new Logger(ContactMessagesService.name);

  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactMessageRepository: Repository<ContactMessage>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateContactMessageDto) {
    const contactMessage = this.contactMessageRepository.create({
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      mobile: dto.mobile?.trim() || null,
      subject: dto.subject.trim(),
      message: dto.message.trim(),
      status: 'New',
    });

    let savedMessage: ContactMessage;

    try {
      savedMessage = await this.contactMessageRepository.save(contactMessage);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        'code' in error.driverError &&
        error.driverError.code === 'ER_NO_SUCH_TABLE'
      ) {
        this.logger.error(
          'The contact_messages table is missing. Apply database/migrations/20261021_create_contact_messages.sql.',
        );
        throw new ServiceUnavailableException(
          'Contact message storage is not initialized. The administrator must apply the contact-messages database migration.',
        );
      }

      throw error;
    }

    return {
      success: true,
      message: 'Your message was sent successfully.',
      id: savedMessage.id,
    };
  }

  findAll() {
    return this.contactMessageRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const contactMessage = await this.contactMessageRepository.findOne({
      where: { id },
    });

    if (!contactMessage) {
      throw new NotFoundException('Contact message not found.');
    }

    return contactMessage;
  }

  async reply(id: number, reply: string) {
    const contactMessage = await this.findOne(id);
    const sent = await this.emailService.sendContactReplyEmail({
      email: contactMessage.email,
      name: contactMessage.name,
      subject: contactMessage.subject,
      reply: reply.trim(),
    });

    if (!sent) {
      throw new ServiceUnavailableException(
        'The reply email could not be sent. The message was not marked as replied.',
      );
    }

    contactMessage.reply = reply.trim();
    contactMessage.status = 'Replied';

    return this.contactMessageRepository.save(contactMessage);
  }

  async remove(id: number) {
    const contactMessage = await this.findOne(id);
    await this.contactMessageRepository.remove(contactMessage);

    return { success: true, message: 'Contact message deleted.' };
  }
}
