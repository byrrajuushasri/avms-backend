import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExecutiveBody } from './entity/executive-body.entity';
import { CreateExecutiveBodyDto } from './dto/create-executive-body.dto';

@Injectable()
export class ExecutiveBodiesService {
  constructor(
    @InjectRepository(ExecutiveBody)
    private readonly repository: Repository<ExecutiveBody>,
  ) {}

  async create(dto: CreateExecutiveBodyDto) {
    const body = this.repository.create(dto);

    return this.repository.save(body);
  }

  async findAll() {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const body = await this.repository.findOne({
      where: { id },
    });

    if (!body) {
      throw new NotFoundException(
        'Executive Body not found',
      );
    }

    return body;
  }

  async update(
    id: number,
    dto: CreateExecutiveBodyDto,
  ) {
    const body = await this.findOne(id);

    Object.assign(body, dto);

    return this.repository.save(body);
  }

  async remove(id: number) {
    const body = await this.findOne(id);

    await this.repository.remove(body);

    return {
      message: 'Executive Body deleted successfully',
    };
  }
}