import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reunion } from './reunion.entity';
import { CreateReunionDto } from './dto/create-reunion.dto';
import { UpdateReunionDto } from './dto/update-reunion.dto';

@Injectable()
export class ReunionService {
  constructor(
    @InjectRepository(Reunion)
    private reunionesRepository: Repository<Reunion>,
  ) {}

  async create(createReunionDto: CreateReunionDto): Promise<Reunion> {
    const newReunion = this.reunionesRepository.create(createReunionDto);
    return this.reunionesRepository.save(newReunion);
  }

  async findAll(): Promise<Reunion[]> {
    return this.reunionesRepository.find();
  }

  async findOne(id: number): Promise<Reunion> {
    const reunion = await this.reunionesRepository.findOne({ where: { idReunion: id } });
    if (!reunion) {
      throw new NotFoundException(`Reunión con ID ${id} no encontrada`);
    }
    return reunion;
  }

  async update(id: number, updateReunionDto: UpdateReunionDto): Promise<Reunion> {
    const reunion = await this.findOne(id);
    this.reunionesRepository.merge(reunion, updateReunionDto);
    return this.reunionesRepository.save(reunion);
  }

  async remove(id: number): Promise<void> {
    const result = await this.reunionesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Reunión con ID ${id} no encontrada`);
    }
  }
}