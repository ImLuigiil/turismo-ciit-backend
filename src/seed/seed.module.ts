// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Comunidad } from '../comunidad/comunidad.entity'; // Importa la entidad Comunidad
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comunidad]), // Le dice a NestJS/TypeORM que este módulo usará el repositorio de Comunidad
    ConfigModule, // Asegúrate de que ConfigModule esté importado aquí también si no es global
  ],
  providers: [SeedService],
  exports: [SeedService], // Exporta el SeedService para que main.ts pueda acceder a él
})
export class SeedModule {}