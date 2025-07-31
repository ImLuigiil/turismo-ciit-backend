// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- CONFIGURACIÓN CRÍTICA DE CORS PARA MÚLTIPLES ORÍGENES ---
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  let allowedOrigins: string | string[];

  if (frontendUrl.includes(',')) {
    // Si la variable de entorno contiene comas, la dividimos en un array
    allowedOrigins = frontendUrl.split(',').map(url => url.trim());
  } else {
    // Si no hay comas, es un solo origen
    allowedOrigins = frontendUrl;
  }

  app.enableCors({
    origin: allowedOrigins, // Ahora puede ser un string o un array de strings
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // --- FIN CONFIGURACIÓN CORS ---

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
