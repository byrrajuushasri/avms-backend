import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TempleEvent } from "./entities/temple-event.entity";
import { CreateTempleEventDto } from "./dto/create-temple-event.dto";

@Injectable()
export class TempleEventsService {
  constructor(
    @InjectRepository(TempleEvent)
    private readonly templeEventRepository: Repository<TempleEvent>,
  ) {}

  async create(dto: CreateTempleEventDto) {
    const event =
      this.templeEventRepository.create({
        ...dto,
        status:
          dto.status !== undefined
            ? dto.status
            : true,
      });

    return this.templeEventRepository.save(event);
  }

  async findAll() {
    return this.templeEventRepository.find({
      where: {
        status: true,
      },
      order: {
        date: "ASC",
      },
    });
  }

  async findAllAdmin() {
    return this.templeEventRepository.find({
      order: {
        date: "ASC",
      },
    });
  }

  async findOne(id: number) {
    const event =
      await this.templeEventRepository.findOne({
        where: { id },
      });

    if (!event) {
      throw new NotFoundException(
        `Temple event with ID ${id} not found`,
      );
    }

    return event;
  }

  async update(
    id: number,
    dto: Partial<CreateTempleEventDto>,
  ) {
    const event = await this.findOne(id);

    Object.assign(event, dto);

    return this.templeEventRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);

    await this.templeEventRepository.remove(event);

    return {
      message: "Temple event deleted successfully",
    };
  }
}