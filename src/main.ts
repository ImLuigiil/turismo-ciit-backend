// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- CONFIGURACIÓN CRÍTICA DE CORS ---
  app.enableCors({
    // ¡CAMBIO CLAVE AQUÍ!
    // Utiliza la variable de entorno FRONTEND_URL para el origen en producción.
    // Asegúrate de que esta variable esté configurada en Clever Cloud con la URL de Netlify.
    // Para desarrollo local, sigue usando 'http://localhost:3001'.
    origin: process.env.FRONTEND_URL || 'http://localhost:3001', 
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
