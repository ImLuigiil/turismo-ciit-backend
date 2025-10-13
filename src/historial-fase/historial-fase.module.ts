import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialFase } from './historial-fase.entity';
import { HistorialFaseService } from './historial-fase.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialFase])],
  providers: [HistorialFaseService],
  exports: [HistorialFaseService], // Exportamos para que ProyectoService pueda usarlo
})
export class HistorialFaseModule {}