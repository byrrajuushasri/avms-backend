import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Satram } from "./entities/satram.entity";
import { SatramsController } from "./satrams.controller";
import { SatramsService } from "./satrams.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Satram]),
  ],

  controllers: [
    SatramsController,
  ],

  providers: [
    SatramsService,
  ],

  exports: [
    SatramsService,
  ],
})
export class SatramsModule {}