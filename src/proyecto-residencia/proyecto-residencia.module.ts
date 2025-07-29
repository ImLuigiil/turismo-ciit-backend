import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoResidenciaService } from './proyecto-residencia.service';
import { ProyectoResidenciaController } from './proyecto-residencia.controller';
import { ProyectoResidencia } from './proyecto-residencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProyectoResidencia])],
  controllers: [ProyectoResidenciaController],
  providers: [ProyectoResidenciaService],
  exports: [ProyectoResidenciaService]
})
export class ProyectoResidenciaModule {}