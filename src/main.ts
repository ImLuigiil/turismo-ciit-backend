// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SeedService } from './seed/seed.service'; // ¡Importa el SeedService!

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT || 3000);

  // --- ¡CORRECCIÓN CLAVE AQUÍ! Descomentar para ejecutar el sembrado ---
  // Este código se ejecutará una vez al inicio del servidor.
  // ¡COMENTA O ELIMINA ESTAS LÍNEAS DESPUÉS DE LA PRIMERA EJECUCIÓN EXITOSA!
  const seedService = app.get(SeedService);
  await seedService.seedOaxacaMunicipalities();
  // --- FIN CORRECCIÓN ---
}
bootstrap();
