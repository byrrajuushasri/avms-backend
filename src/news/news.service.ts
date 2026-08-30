import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { News } from "./entities/news.entity";
import { CreateNewsDto } from "./dto/create-news.dto";

import * as fs from "fs";
import * as path from "path";

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(
    createNewsDto: CreateNewsDto,
    file?: Express.Multer.File,
  ) {
    let mediaUrl: string | null = null;

    // IMAGE
    if (createNewsDto.mediaType === "Image") {
      if (!file) {
        throw new Error("Image file is required.");
      }

      mediaUrl = `/uploads/news/${file.filename}`;
    }

    // VIDEO
    if (createNewsDto.mediaType === "Video") {
      if (!createNewsDto.mediaUrl?.trim()) {
        throw new Error("Video URL is required.");
      }

      mediaUrl = createNewsDto.mediaUrl.trim();
    }

    const news = this.newsRepository.create({
      title: createNewsDto.title.trim(),

      description:
        createNewsDto.description.trim(),

      category: createNewsDto.category,

      location:
        createNewsDto.location?.trim() || null,

      date: createNewsDto.date,

      mediaType: createNewsDto.mediaType,

      mediaUrl,

      featured:
        createNewsDto.featured === "true" ||
        createNewsDto.featured === "1",

      status:
        createNewsDto.status || "Active",
    });

    return await this.newsRepository.save(news);
  }

  // =========================================================
  // GET ALL
  // =========================================================

  async findAll() {
    return await this.newsRepository.find({
      order: {
        id: "DESC",
      },
    });
  }

  // =========================================================
  // GET ONE
  // =========================================================

  async findOne(id: number) {
    const news = await this.newsRepository.findOne({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException(
        "News not found.",
      );
    }

    return news;
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    id: number,
    createNewsDto: CreateNewsDto,
    file?: Express.Multer.File,
  ) {
    const news = await this.findOne(id);

    // Keep old image
    let mediaUrl = news.mediaUrl;

    // New IMAGE
    if (createNewsDto.mediaType === "Image") {
      if (file) {
        // Delete old uploaded image
        this.deleteUploadedFile(
          news.mediaUrl,
        );

        mediaUrl = `/uploads/news/${file.filename}`;
      } else if (!news.mediaUrl) {
        throw new Error(
          "Image file is required.",
        );
      }
    }

    // VIDEO
    if (createNewsDto.mediaType === "Video") {
      if (!createNewsDto.mediaUrl?.trim()) {
        throw new Error(
          "Video URL is required.",
        );
      }

      // If old media was an uploaded image,
      // delete it.
      if (
        news.mediaType === "Image"
      ) {
        this.deleteUploadedFile(
          news.mediaUrl,
        );
      }

      mediaUrl =
        createNewsDto.mediaUrl.trim();
    }

    news.title =
      createNewsDto.title.trim();

    news.description =
      createNewsDto.description.trim();

    news.category =
      createNewsDto.category;

    news.location =
      createNewsDto.location?.trim() ||
      null;

    news.date =
      createNewsDto.date;

    news.mediaType =
      createNewsDto.mediaType;

    news.mediaUrl =
      mediaUrl;

    news.featured =
      createNewsDto.featured === "true" ||
      createNewsDto.featured === "1";

    news.status =
      createNewsDto.status ||
      "Active";

    return await this.newsRepository.save(
      news,
    );
  }

  // =========================================================
  // DELETE
  // =========================================================

  async remove(id: number) {
    const news = await this.findOne(id);

    // Delete uploaded image
    if (
      news.mediaType === "Image"
    ) {
      this.deleteUploadedFile(
        news.mediaUrl,
      );
    }

    await this.newsRepository.remove(
      news,
    );

    return {
      message:
        "News deleted successfully.",
    };
  }

  // =========================================================
  // DELETE UPLOADED FILE
  // =========================================================

  private deleteUploadedFile(
    mediaUrl: string | null,
  ) {
    if (
      !mediaUrl ||
      !mediaUrl.startsWith(
        "/uploads/news/",
      )
    ) {
      return;
    }

    const filename =
      path.basename(mediaUrl);

    const filePath = path.join(
      process.cwd(),
      "uploads",
      "news",
      filename,
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}