import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComunidadService } from './comunidad.service';
import { ComunidadController } from './comunidad.controller';
import { Comunidad } from './comunidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comunidad])],
  controllers: [ComunidadController],
  providers: [ComunidadService],
  exports: [ComunidadService]
})
export class ComunidadModule {}