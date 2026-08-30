import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Satram } from "./entities/satram.entity";
import { CreateSatramDto } from "./dto/create-satram.dto";

@Injectable()
export class SatramsService {
  constructor(
    @InjectRepository(Satram)
    private readonly satramRepository: Repository<Satram>,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(
    createSatramDto: CreateSatramDto,
  ): Promise<Satram> {
    const satram = new Satram();

    satram.name = createSatramDto.name;

    satram.state =
      createSatramDto.state ?? null;

    satram.district =
      createSatramDto.district ?? null;

    satram.mandal =
      createSatramDto.mandal ?? null;

    satram.sangam =
      createSatramDto.sangam ?? null;

    satram.place =
      createSatramDto.place ?? null;

    satram.address =
      createSatramDto.address ?? null;

    satram.contact =
      createSatramDto.contact ?? null;

    satram.annadanam =
      createSatramDto.annadanam ?? true;

    satram.accommodation =
      createSatramDto.accommodation ?? true;

    satram.description =
      createSatramDto.description ?? null;

    satram.mapUrl =
      createSatramDto.mapUrl ?? null;

    return await this.satramRepository.save(
      satram,
    );
  }

  // =========================================================
  // GET ALL
  // =========================================================

  async findAll(): Promise<Satram[]> {
    return await this.satramRepository.find({
      order: {
        created_at: "DESC",
      },
    });
  }

  // =========================================================
  // GET ONE
  // =========================================================

  async findOne(
    id: number,
  ): Promise<Satram> {
    const satram =
      await this.satramRepository.findOne({
        where: {
          id,
        },
      });

    if (!satram) {
      throw new NotFoundException(
        `Satram with ID ${id} not found`,
      );
    }

    return satram;
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    id: number,
    updateSatramDto: Partial<CreateSatramDto>,
  ): Promise<Satram> {
    const satram =
      await this.findOne(id);

    if (
      updateSatramDto.name !==
      undefined
    ) {
      satram.name =
        updateSatramDto.name;
    }

    if (
      updateSatramDto.state !==
      undefined
    ) {
      satram.state =
        updateSatramDto.state;
    }

    if (
      updateSatramDto.district !==
      undefined
    ) {
      satram.district =
        updateSatramDto.district;
    }

    if (
      updateSatramDto.mandal !==
      undefined
    ) {
      satram.mandal =
        updateSatramDto.mandal;
    }

    if (
      updateSatramDto.sangam !==
      undefined
    ) {
      satram.sangam =
        updateSatramDto.sangam;
    }

    if (
      updateSatramDto.place !==
      undefined
    ) {
      satram.place =
        updateSatramDto.place;
    }

    if (
      updateSatramDto.address !==
      undefined
    ) {
      satram.address =
        updateSatramDto.address;
    }

    if (
      updateSatramDto.contact !==
      undefined
    ) {
      satram.contact =
        updateSatramDto.contact;
    }

    if (
      updateSatramDto.annadanam !==
      undefined
    ) {
      satram.annadanam =
        updateSatramDto.annadanam;
    }

    if (
      updateSatramDto.accommodation !==
      undefined
    ) {
      satram.accommodation =
        updateSatramDto.accommodation;
    }

    if (
      updateSatramDto.description !==
      undefined
    ) {
      satram.description =
        updateSatramDto.description;
    }

    if (
      updateSatramDto.mapUrl !==
      undefined
    ) {
      satram.mapUrl =
        updateSatramDto.mapUrl;
    }

    return await this.satramRepository.save(
      satram,
    );
  }

  // =========================================================
  // DELETE
  // =========================================================

  async remove(
    id: number,
  ): Promise<{
    message: string;
  }> {
    const satram =
      await this.findOne(id);

    await this.satramRepository.remove(
      satram,
    );

    return {
      message:
        "Satram deleted successfully",
    };
  }
}