import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('image')
  async getImage(
    @Query('key') key: string | undefined,
    @Res() response: Response,
  ) {
    if (
      !key ||
      !/^(members|matrimonial|blog)\/[a-f0-9-]+\.(jpg|png|webp)$/i.test(
        key,
      )
    ) {
      throw new BadRequestException('Invalid image key.');
    }

    const imageUrl = await this.storageService.getImageUrl(key);

    response.setHeader('Cache-Control', 'private, no-store');
    return response.redirect(302, imageUrl);
  }
}
