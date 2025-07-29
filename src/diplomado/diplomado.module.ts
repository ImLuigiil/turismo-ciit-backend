import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiplomadoService } from './diplomado.service';
import { DiplomadoController } from './diplomado.controller';
import { Diplomado } from './diplomado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diplomado])],
  controllers: [DiplomadoController],
  providers: [DiplomadoService],
  exports: [DiplomadoService]
})
export class DiplomadoModule {}