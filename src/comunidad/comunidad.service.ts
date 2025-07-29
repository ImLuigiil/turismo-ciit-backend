import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comunidad } from './comunidad.entity';
import { CreateComunidadDto } from './dto/create-comunidad.dto';
import { UpdateComunidadDto } from './dto/update-comunidad.dto';

@Injectable()
export class ComunidadService {
  constructor(
    @InjectRepository(Comunidad)
    private comunidadesRepository: Repository<Comunidad>,
  ) {}

  async create(createComunidadDto: CreateComunidadDto): Promise<Comunidad> {
    const newComunidad = this.comunidadesRepository.create(createComunidadDto);
    return this.comunidadesRepository.save(newComunidad);
  }

  async findAll(): Promise<Comunidad[]> {
    return this.comunidadesRepository.find();
  }

  async findOne(id: number): Promise<Comunidad> {
    const comunidad = await this.comunidadesRepository.findOne({ where: { idComunidad: id } });
    if (!comunidad) {
      throw new NotFoundException(`Comunidad con ID ${id} no encontrada`);
    }
    return comunidad;
  }

  async update(id: number, updateComunidadDto: UpdateComunidadDto): Promise<Comunidad> {
    const comunidad = await this.findOne(id);
    this.comunidadesRepository.merge(comunidad, updateComunidadDto);
    return this.comunidadesRepository.save(comunidad);
  }

  async remove(id: number): Promise<void> {
    const result = await this.comunidadesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comunidad con ID ${id} no encontrada`);
    }
  }
}