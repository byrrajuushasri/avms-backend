import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Location,
  LocationType,
} from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // =========================================================
  // GET ALL DISTRICTS
  // GET /locations/districts
  // =========================================================

  async findDistricts() {
    return this.locationRepository.find({
      where: {
        type: LocationType.DISTRICT,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  // =========================================================
  // GET MANDALS BY DISTRICT
  // GET /locations/districts/:districtId/mandals
  // =========================================================

  async findMandalsByDistrict(districtId: number) {
    const district = await this.locationRepository.findOne({
      where: {
        id: districtId,
        type: LocationType.DISTRICT,
      },
    });

    if (!district) {
      throw new NotFoundException(
        `District with ID ${districtId} not found`,
      );
    }

    return this.locationRepository.find({
      where: {
        parent_id: districtId,
        type: LocationType.MANDAL,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  // =========================================================
  // GET SANGHAMS BY MANDAL
  // GET /locations/mandals/:mandalId/sanghams
  // =========================================================

  async findSanghamsByMandal(mandalId: number) {
    const mandal = await this.locationRepository.findOne({
      where: {
        id: mandalId,
        type: LocationType.MANDAL,
      },
    });

    if (!mandal) {
      throw new NotFoundException(
        `Mandal with ID ${mandalId} not found`,
      );
    }

    return this.locationRepository.find({
      where: {
        parent_id: mandalId,
        type: LocationType.SANGHAM,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  // =========================================================
  // GET ONE LOCATION
  // GET /locations/:id
  // =========================================================

  async findOne(id: number) {
    const location = await this.locationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(
        `Location with ID ${id} not found`,
      );
    }

    return location;
  }

  // =========================================================
  // CREATE LOCATION
  // POST /locations
  // =========================================================

  async create(data: {
    name: string;
    type: LocationType;
    parent_id?: number | null;
  }) {
    const name = data.name?.trim();

    if (!name) {
      throw new BadRequestException(
        'Location name is required',
      );
    }

    // District must not have parent
    if (
      data.type === LocationType.DISTRICT &&
      data.parent_id
    ) {
      throw new BadRequestException(
        'District cannot have parent_id',
      );
    }

    // Mandal and Sangham must have parent
    if (
      data.type !== LocationType.DISTRICT &&
      !data.parent_id
    ) {
      throw new BadRequestException(
        'parent_id is required',
      );
    }

    // Validate parent
    if (data.parent_id) {
      const parent =
        await this.locationRepository.findOne({
          where: {
            id: data.parent_id,
          },
        });

      if (!parent) {
        throw new NotFoundException(
          'Parent location not found',
        );
      }

      if (
        data.type === LocationType.MANDAL &&
        parent.type !== LocationType.DISTRICT
      ) {
        throw new BadRequestException(
          'Mandal parent must be a district',
        );
      }

      if (
        data.type === LocationType.SANGHAM &&
        parent.type !== LocationType.MANDAL
      ) {
        throw new BadRequestException(
          'Sangham parent must be a mandal',
        );
      }
    }

    const location =
      this.locationRepository.create({
        name,
        type: data.type,
        parent_id: data.parent_id ?? null,
      });

    return this.locationRepository.save(location);
  }

  // =========================================================
  // UPDATE
  // PATCH /locations/:id
  // =========================================================

  async update(
    id: number,
    data: {
      name?: string;
      type?: LocationType;
      parent_id?: number | null;
    },
  ) {
    const location = await this.findOne(id);

    if (data.name !== undefined) {
      location.name = data.name.trim();
    }

    if (data.type !== undefined) {
      location.type = data.type;
    }

    if (data.parent_id !== undefined) {
      location.parent_id = data.parent_id;
    }

    return this.locationRepository.save(location);
  }

  // =========================================================
  // DELETE
  // DELETE /locations/:id
  // =========================================================

  async remove(id: number) {
    const location = await this.findOne(id);

    await this.locationRepository.remove(location);

    return {
      success: true,
      message: 'Location deleted successfully',
    };
  }
}