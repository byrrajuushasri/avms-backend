import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from "@nestjs/common";

import {
  FileInterceptor,
} from "@nestjs/platform-express";

import {
  diskStorage,
} from "multer";

import {
  extname,
} from "path";

import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";

@Controller("news")
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  @Post()
  @UseInterceptors(
    FileInterceptor("media", {
      storage: diskStorage({
        destination:
          "./uploads/news",

        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}${extname(
              file.originalname,
            )}`;

          callback(
            null,
            uniqueName,
          );
        },
      }),

      limits: {
        fileSize:
          10 * 1024 * 1024,
      },

      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes =
          [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ];

        if (
          allowedTypes.includes(
            file.mimetype,
          )
        ) {
          callback(
            null,
            true,
          );
        } else {
          callback(
            new Error(
              "Only JPG, PNG, WEBP and GIF images are allowed.",
            ),
            false,
          );
        }
      },
    }),
  )
  async create(
    @Body() createNewsDto: CreateNewsDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.newsService.create(
      createNewsDto,
      file,
    );
  }

  // =========================================================
  // GET ALL
  // =========================================================

  @Get()
  async findAll() {
    return this.newsService.findAll();
  }

  // =========================================================
  // GET ONE
  // =========================================================

  @Get(":id")
  async findOne(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.newsService.findOne(id);
  }

  // =========================================================
  // UPDATE
  // =========================================================

  @Patch(":id")
  @UseInterceptors(
    FileInterceptor("media", {
      storage: diskStorage({
        destination:
          "./uploads/news",

        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}${extname(
              file.originalname,
            )}`;

          callback(
            null,
            uniqueName,
          );
        },
      }),

      limits: {
        fileSize:
          10 * 1024 * 1024,
      },

      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes =
          [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ];

        if (
          allowedTypes.includes(
            file.mimetype,
          )
        ) {
          callback(
            null,
            true,
          );
        } else {
          callback(
            new Error(
              "Only JPG, PNG, WEBP and GIF images are allowed.",
            ),
            false,
          );
        }
      },
    }),
  )
  async update(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,

    @Body()
    createNewsDto: CreateNewsDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.newsService.update(
      id,
      createNewsDto,
      file,
    );
  }

  // =========================================================
  // DELETE
  // =========================================================

  @Delete(":id")
  async remove(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.newsService.remove(id);
  }
}