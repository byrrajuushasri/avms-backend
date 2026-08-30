import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TempleEvent } from "./entities/temple-event.entity";
import { TempleEventsController } from "./temple-events.controller";
import { TempleEventsService } from "./temple-events.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([TempleEvent]),
  ],

  controllers: [
    TempleEventsController,
  ],

  providers: [
    TempleEventsService,
  ],

  exports: [
    TempleEventsService,
  ],
})
export class TempleEventsModule {}