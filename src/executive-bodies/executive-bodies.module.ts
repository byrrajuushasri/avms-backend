import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExecutiveBody } from './entity/executive-body.entity';
import { ExecutiveBodiesController } from './executive-bodies.controller';
import { ExecutiveBodiesService } from './executive-bodies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExecutiveBody,
    ]),
  ],

  controllers: [
    ExecutiveBodiesController,
  ],

  providers: [
    ExecutiveBodiesService,
  ],

  exports: [
    ExecutiveBodiesService,
  ],
})
export class ExecutiveBodiesModule {}