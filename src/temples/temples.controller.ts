import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

import { TemplesService } from "./temples.service";
import { CreateTempleDto } from "./dto/create-temple.dto";

@Controller("temples")
export class TemplesController {
  constructor(
    private readonly templesService: TemplesService,
  ) {}

  @Get()
  findAll() {
    return this.templesService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.templesService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads/temples",
        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}${extname(file.originalname)}`;

          callback(null, uniqueName);
        },
      }),
    }),
  )
  create(
    @Body() createTempleDto: CreateTempleDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.templesService.create(
      createTempleDto,
      file,
    );
  }

  @Patch(":id")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads/temples",
        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}${extname(file.originalname)}`;

          callback(null, uniqueName);
        },
      }),
    }),
  )
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateTempleDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.templesService.update(
      id,
      updateData,
      file,
    );
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.templesService.remove(id);
  }
}