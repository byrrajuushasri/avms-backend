import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );


  // ==========================================
  // STATIC UPLOADS
  // ==========================================

  app.useStaticAssets(
    join(process.cwd(), "uploads"),
    {
      prefix: "/uploads/",
    },
  );

  // ==========================================
  // CORS
  // ==========================================

  app.enableCors({
  origin: [
    "http://localhost:3000",
    "https://avms-frontend-pqfz2osec-ushasri-s-projects.vercel.app",
    "https://www.aaryavysyamahasabha.com",
    "https://aaryavysyamahasabha.com",
  ],
  credentials: true,
});


  // ==========================================
  // START SERVER
  // ==========================================

  await app.listen(5000);

  console.log(
    "Backend running: http://localhost:5000",
  );

  console.log(
    "Uploads available at: http://localhost:5000/uploads/",
  );
}

bootstrap();