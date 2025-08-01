// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Comunidad } from '../comunidad/comunidad.entity'; 
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comunidad]), 
    ConfigModule, 
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}