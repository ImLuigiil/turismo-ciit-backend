import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialFase } from './historial-fase.entity';

@Injectable()
export class HistorialFaseService {
  constructor(
    @InjectRepository(HistorialFase)
    private historialFaseRepository: Repository<HistorialFase>,
  ) {}

  async create(data: Partial<HistorialFase>): Promise<HistorialFase> {
    const newRecord = this.historialFaseRepository.create(data);
    return this.historialFaseRepository.save(newRecord);
  }
}