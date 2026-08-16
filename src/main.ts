import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const uploadPath = join(
    process.cwd(),
    'uploads',
    'matrimonial',
  );

  console.log('UPLOAD PATH:', uploadPath);

  app.use(
    '/uploads/matrimonial',
    express.static(uploadPath),
  );

  await app.listen(5000);

  console.log('Backend running: http://localhost:5000');
}

bootstrap();