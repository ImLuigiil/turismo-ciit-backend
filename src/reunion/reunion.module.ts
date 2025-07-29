import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReunionService } from './reunion.service';
import { ReunionController } from './reunion.controller';
import { Reunion } from './reunion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reunion])],
  controllers: [ReunionController],
  providers: [ReunionService],
  exports: [ReunionService]
})
export class ReunionModule {}