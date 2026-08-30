import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Temple } from "./entities/temple.entity";
import { CreateTempleDto } from "./dto/create-temple.dto";

@Injectable()
export class TemplesService {
  constructor(
    @InjectRepository(Temple)
    private readonly templeRepository: Repository<Temple>,
  ) {}

  // CREATE
  async create(
    createTempleDto: CreateTempleDto,
    file?: Express.Multer.File,
  ): Promise<Temple> {
    const temple = this.templeRepository.create({
      ...createTempleDto,

      image: file
        ? file.filename
        : null,
    });

   return this.templeRepository.save(temple);
  }

  // GET ALL
  async findAll(): Promise<Temple[]> {
    return await this.templeRepository.find({
      order: {
        created_at: "DESC",
      },
    });
  }

  // GET ONE
  async findOne(id: number): Promise<Temple> {
    const temple = await this.templeRepository.findOne({
      where: { id },
    });

    if (!temple) {
      throw new NotFoundException(
        `Temple with ID ${id} not found`,
      );
    }

    return temple;
  }

  // UPDATE
  async update(
    id: number,
    updateData: Partial<CreateTempleDto>,
    file?: Express.Multer.File,
  ): Promise<Temple> {
    const temple = await this.findOne(id);

    Object.assign(temple, updateData);

    if (file) {
      temple.image = file.filename;
    }

    return await this.templeRepository.save(temple);
  }

  // DELETE
  async remove(
    id: number,
  ): Promise<{ message: string }> {
    const temple = await this.findOne(id);

    await this.templeRepository.remove(temple);

    return {
      message: "Temple deleted successfully",
    };
  }
}