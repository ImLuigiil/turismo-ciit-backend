import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursoTuristicoService } from './recurso-turistico.service';
import { RecursoTuristicoController } from './recurso-turistico.controller';
import { RecursoTuristico } from './recurso-turistico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecursoTuristico])],
  controllers: [RecursoTuristicoController],
  providers: [RecursoTuristicoService],
  exports: [RecursoTuristicoService]
})
export class RecursoTuristicoModule {}