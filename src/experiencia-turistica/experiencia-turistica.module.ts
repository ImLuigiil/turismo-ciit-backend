import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienciaTuristicaService } from './experiencia-turistica.service';
import { ExperienciaTuristicaController } from './experiencia-turistica.controller';
import { ExperienciaTuristica } from './experiencia-turistica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExperienciaTuristica])],
  controllers: [ExperienciaTuristicaController],
  providers: [ExperienciaTuristicaService],
  exports: [ExperienciaTuristicaService]
})
export class ExperienciaTuristicaModule {}