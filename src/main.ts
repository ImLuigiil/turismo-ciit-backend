    // src/main.ts
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { ValidationPipe } from '@nestjs/common';
    import { NestExpressApplication } from '@nestjs/platform-express';
    import { join } from 'path';
    // Importa el SeedService si aún lo estás usando para sembrar datos al inicio
    // import { SeedService } from './seed/seed.service'; 

    async function bootstrap() {
      const app = await NestFactory.create<NestExpressApplication>(AppModule);

      // --- Configuración de CORS ---
      app.enableCors({
        // Utiliza la variable de entorno FRONTEND_URL para el origen en producción
        // Tu URL de Netlify: https://lighthearted-sopapillas-d33e2b.netlify.app
        origin: process.env.FRONTEND_URL || 'http://localhost:3001', 
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      });
      // --- Fin Configuración de CORS ---

      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));

      // --- Configuración para servir archivos estáticos ---
      // La carpeta 'uploads' debe estar en la raíz de tu proyecto NestJS (al mismo nivel que src, package.json)
      app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/', // Los archivos serán accesibles en http://your-backend-url.com/uploads/nombre.pdf
      });
      // --- Fin Configuración estáticos ---

      // --- EJECUCIÓN TEMPORAL DEL SCRIPT DE SEMBRADO (PARA UNA SOLA VEZ) ---
      // Comenta o elimina estas líneas después de la primera ejecución exitosa en producción
      // para evitar que se ejecute en cada inicio del servidor.
      // const seedService = app.get(SeedService);
      // await seedService.seedOaxacaMunicipalities();
      // --- FIN EJECUCIÓN TEMPORAL ---

      // El puerto de la aplicación. En producción, Clever Cloud asignará un puerto a través de process.env.PORT.
      // Para desarrollo local, usará 3000 si process.env.PORT no está definido.
      await app.listen(process.env.PORT || 3000);
    }
    bootstrap();
    