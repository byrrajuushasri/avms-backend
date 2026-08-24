import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useStaticAssets(
    join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads/',
    },
  );

  await app.listen(5000);

  console.log(
    'Backend running: http://localhost:5000',
  );
}

bootstrap();