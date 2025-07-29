import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diplomado } from './diplomado.entity';
import { CreateDiplomadoDto } from './dto/create-diplomado.dto';
import { UpdateDiplomadoDto } from './dto/update-diplomado.dto';

@Injectable()
export class DiplomadoService {
  constructor(
    @InjectRepository(Diplomado)
    private diplomadosRepository: Repository<Diplomado>,
  ) {}

  async create(createDiplomadoDto: CreateDiplomadoDto): Promise<Diplomado> {
    const newDiplomado = this.diplomadosRepository.create(createDiplomadoDto);
    return this.diplomadosRepository.save(newDiplomado);
  }

  async findAll(): Promise<Diplomado[]> {
    return this.diplomadosRepository.find();
  }

  async findOne(id: number): Promise<Diplomado> {
    const diplomado = await this.diplomadosRepository.findOne({ where: { idDiplomado: id } });
    if (!diplomado) {
      throw new NotFoundException(`Diplomado con ID ${id} no encontrado`);
    }
    return diplomado;
  }

  async update(id: number, updateDiplomadoDto: UpdateDiplomadoDto): Promise<Diplomado> {
    const diplomado = await this.findOne(id);
    this.diplomadosRepository.merge(diplomado, updateDiplomadoDto);
    return this.diplomadosRepository.save(diplomado);
  }

  async remove(id: number): Promise<void> {
    const result = await this.diplomadosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Diplomado con ID ${id} no encontrado`);
    }
  }
}