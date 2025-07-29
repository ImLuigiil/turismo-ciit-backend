import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapacitacionService } from './capacitacion.service';
import { CapacitacionController } from './capacitacion.controller';
import { Capacitacion } from './capacitacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Capacitacion])],
  controllers: [CapacitacionController],
  providers: [CapacitacionService],
  exports: [CapacitacionService]
})
export class CapacitacionModule {}