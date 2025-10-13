import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoController } from './proyecto.controller';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './proyecto.entity';
import { Comunidad } from '../comunidad/comunidad.entity';
import { PersonaProyecto } from '../persona-proyecto/persona-proyecto.entity';
import { ProyectoImagen } from '../proyecto-imagen/proyecto-imagen.entity';
import { HistorialFaseModule } from '../historial-fase/historial-fase.module';
import { HistorialFase } from '../historial-fase/historial-fase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proyecto, 
      Comunidad, 
      PersonaProyecto, 
      ProyectoImagen,
      HistorialFase
    ]),
    HistorialFaseModule,
  ],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService],
})
export class ProyectoModule {}