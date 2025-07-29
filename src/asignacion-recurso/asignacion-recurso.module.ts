import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionRecursoService } from './asignacion-recurso.service';
import { AsignacionRecursoController } from './asignacion-recurso.controller';
import { AsignacionRecurso } from './asignacion-recurso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsignacionRecurso])],
  controllers: [AsignacionRecursoController],
  providers: [AsignacionRecursoService],
  exports: [AsignacionRecursoService]
})
export class AsignacionRecursoModule {}