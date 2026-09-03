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
    origin: [
      "http://localhost:3000",
      "https://www.aaryavysyamahasabha.com",
      "https://aaryavysyamahasabha.com",
    ],
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

  console.log("=================================");
  console.log("Current working directory:", process.cwd());
  console.log("Uploads path:", uploadsPath);
  console.log("Matrimonial path:", matrimonialPath);
  console.log(
    "Uploads folder exists:",
    existsSync(uploadsPath)
  );
  console.log(
    "Matrimonial folder exists:",
    existsSync(matrimonialPath)
  );
  console.log("=================================");

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

  const port = process.env.PORT || 5000;

  await app.listen(port, "0.0.0.0");

  console.log("=================================");
  console.log(`Backend running on port: ${port}`);
  console.log(`Uploads: /uploads/`);
  console.log(`Matrimonial: /uploads/matrimonial/`);
  console.log("=================================");
}

bootstrap();