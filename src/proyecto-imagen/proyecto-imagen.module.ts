// src/proyecto-imagen/proyecto-imagen.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoImagenService } from './proyecto-imagen.service';
import { ProyectoImagenController } from './proyecto-imagen.controller';
import { ProyectoImagen } from './proyecto-imagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProyectoImagen])],
  controllers: [ProyectoImagenController],
  providers: [ProyectoImagenService],
  exports: [ProyectoImagenService]
})
export class ProyectoImagenModule {}
