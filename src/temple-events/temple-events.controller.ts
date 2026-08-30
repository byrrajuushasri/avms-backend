import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";

import { TempleEventsService } from "./temple-events.service";
import { CreateTempleEventDto } from "./dto/create-temple-event.dto";

@Controller("temple-events")
export class TempleEventsController {
  constructor(
    private readonly templeEventsService: TempleEventsService,
  ) {}

  // =========================================================
  // CREATE EVENT
  // POST /temple-events
  // =========================================================

  @Post()
  async create(
    @Body() dto: CreateTempleEventDto,
  ) {
    return this.templeEventsService.create(dto);
  }

  // =========================================================
  // GET ACTIVE EVENTS
  // GET /temple-events
  // =========================================================

  @Get()
  async findAll() {
    return this.templeEventsService.findAll();
  }

  // =========================================================
  // GET ALL EVENTS - ADMIN
  // GET /temple-events/admin/all
  // =========================================================

  @Get("admin/all")
  async findAllAdmin() {
    return this.templeEventsService.findAllAdmin();
  }

  // =========================================================
  // GET SINGLE EVENT
  // GET /temple-events/:id
  // =========================================================

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.templeEventsService.findOne(id);
  }

  // =========================================================
  // UPDATE EVENT
  // PUT /temple-events/:id
  // =========================================================

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Partial<CreateTempleEventDto>,
  ) {
    return this.templeEventsService.update(id, dto);
  }

  // =========================================================
  // DELETE EVENT
  // DELETE /temple-events/:id
  // =========================================================

  @Delete(":id")
  async remove(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.templeEventsService.remove(id);
  }
}