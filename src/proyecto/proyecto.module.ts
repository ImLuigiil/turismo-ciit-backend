// src/proyecto/proyecto.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { Proyecto } from './proyecto.entity';
import { ProyectoImagen } from '../proyecto-imagen/proyecto-imagen.entity'; // ¡Importa la entidad ProyectoImagen!

@Module({
  imports: [
    TypeOrmModule.forFeature([Proyecto, ProyectoImagen]), // ¡Añade ProyectoImagen aquí!
  ],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService],
})
export class ProyectoModule {}
