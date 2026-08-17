import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Static uploaded files
  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads')),
  );

  await app.listen(5000);

  console.log('Backend running: http://localhost:5000');
}

bootstrap();