import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { LocationsService } from './locations.service';
import { LocationType } from './entities/location.entity';

@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
  ) {}

  // =========================================================
  // DISTRICTS
  // =========================================================

  @Get('districts')
  getDistricts() {
    return this.locationsService.findDistricts();
  }

  // =========================================================
  // MANDALS
  // =========================================================

  @Get('districts/:districtId/mandals')
  getMandals(
    @Param('districtId', ParseIntPipe)
    districtId: number,
  ) {
    return this.locationsService.findMandalsByDistrict(
      districtId,
    );
  }

  // =========================================================
  // SANGHAMS
  // =========================================================

  @Get('mandals/:mandalId/sanghams')
  getSanghams(
    @Param('mandalId', ParseIntPipe)
    mandalId: number,
  ) {
    return this.locationsService.findSanghamsByMandal(
      mandalId,
    );
  }

  // =========================================================
  // ONE LOCATION
  // =========================================================

  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.locationsService.findOne(id);
  }

  // =========================================================
  // CREATE
  // =========================================================

  @Post()
  create(
    @Body()
    body: {
      name: string;
      type: LocationType;
      parent_id?: number | null;
    },
  ) {
    return this.locationsService.create(body);
  }

  // =========================================================
  // UPDATE
  // =========================================================

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: {
      name?: string;
      type?: LocationType;
      parent_id?: number | null;
    },
  ) {
    return this.locationsService.update(id, body);
  }

  // =========================================================
  // DELETE
  // =========================================================

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.locationsService.remove(id);
  }
}