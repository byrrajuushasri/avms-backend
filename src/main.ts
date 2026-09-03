import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import * as express from "express";
import { existsSync } from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ==========================================
  // CORS
  // ==========================================

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  // ==========================================
  // UPLOADS FOLDER
  // ==========================================

  const uploadsPath = join(
    process.cwd(),
    "uploads"
  );

  const matrimonialPath = join(
    uploadsPath,
    "matrimonial"
  );

  console.log(
    "================================="
  );

  console.log(
    "Current working directory:",
    process.cwd()
  );

  console.log(
    "Uploads path:",
    uploadsPath
  );

  console.log(
    "Matrimonial path:",
    matrimonialPath
  );

  console.log(
    "Uploads folder exists:",
    existsSync(uploadsPath)
  );

  console.log(
    "Matrimonial folder exists:",
    existsSync(matrimonialPath)
  );

  console.log(
    "================================="
  );

  // ==========================================
  // SERVE UPLOADED FILES
  // ==========================================

  app.use(
    "/uploads",
    express.static(uploadsPath)
  );

  // ==========================================
  // START SERVER
  // ==========================================

  await app.listen(5000);

  console.log(
    "Backend running:"
  );

  console.log(
    "http://localhost:5000"
  );

  console.log(
    "Uploads URL:"
  );

  console.log(
    "http://localhost:5000/uploads/"
  );

  console.log(
    "Matrimonial URL:"
  );

  console.log(
    "http://localhost:5000/uploads/matrimonial/"
  );

  console.log(
    "================================="
  );
}

bootstrap();