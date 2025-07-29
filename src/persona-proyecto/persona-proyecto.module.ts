// src/persona-proyecto/persona-proyecto.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaProyectoService } from './persona-proyecto.service';
import { PersonaProyectoController } from './persona-proyecto.controller';
import { PersonaProyecto } from './persona-proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonaProyecto])],
  controllers: [PersonaProyectoController],
  providers: [PersonaProyectoService],
  exports: [PersonaProyectoService] // Exporta si el ProyectoService lo necesita
})
export class PersonaProyectoModule {}