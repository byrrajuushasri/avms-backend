import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { ExecutiveBodiesService } from './executive-bodies.service';

import { CreateExecutiveBodyDto } from './dto/create-executive-body.dto';

@Controller('executive-bodies')
export class ExecutiveBodiesController {
  constructor(
    private readonly service: ExecutiveBodiesService,
  ) {}

  @Post()
  create(@Body() dto: CreateExecutiveBodyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateExecutiveBodyDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(id);
  }
}