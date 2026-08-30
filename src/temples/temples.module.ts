import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Temple } from "./entities/temple.entity";
import { TemplesController } from "./temples.controller";
import { TemplesService } from "./temples.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Temple]),
  ],
  controllers: [TemplesController],
  providers: [TemplesService],
  exports: [TemplesService],
})
export class TemplesModule {}