import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";

import { SatramsService } from "./satrams.service";
import { CreateSatramDto } from "./dto/create-satram.dto";

@Controller("satrams")
export class SatramsController {
  constructor(
    private readonly satramsService: SatramsService,
  ) {}

  @Post()
  create(
    @Body() createSatramDto: CreateSatramDto,
  ) {
    return this.satramsService.create(
      createSatramDto,
    );
  }

  @Get()
  findAll() {
    return this.satramsService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.satramsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSatramDto: Partial<CreateSatramDto>,
  ) {
    return this.satramsService.update(
      id,
      updateSatramDto,
    );
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.satramsService.remove(id);
  }
}