import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsignacionRecurso } from './asignacion-recurso.entity';
import { CreateAsignacionRecursoDto } from './dto/create-asignacion-recurso.dto';
import { UpdateAsignacionRecursoDto } from './dto/update-asignacion-recurso.dto';

@Injectable()
export class AsignacionRecursoService {
  constructor(
    @InjectRepository(AsignacionRecurso)
    private asignacionRecursosRepository: Repository<AsignacionRecurso>,
  ) {}

  async create(createAsignacionRecursoDto: CreateAsignacionRecursoDto): Promise<AsignacionRecurso> {
    const newAsignacionRecurso = this.asignacionRecursosRepository.create(createAsignacionRecursoDto);
    return this.asignacionRecursosRepository.save(newAsignacionRecurso);
  }

  async findAll(): Promise<AsignacionRecurso[]> {
    return this.asignacionRecursosRepository.find();
  }

  async findOne(id: number): Promise<AsignacionRecurso> {
    const asignacionRecurso = await this.asignacionRecursosRepository.findOne({ where: { idAsg: id } });
    if (!asignacionRecurso) {
      throw new NotFoundException(`Asignación de Recurso con ID ${id} no encontrada`);
    }
    return asignacionRecurso;
  }

  async update(id: number, updateAsignacionRecursoDto: UpdateAsignacionRecursoDto): Promise<AsignacionRecurso> {
    const asignacionRecurso = await this.findOne(id);
    this.asignacionRecursosRepository.merge(asignacionRecurso, updateAsignacionRecursoDto);
    return this.asignacionRecursosRepository.save(asignacionRecurso);
  }

  async remove(id: number): Promise<void> {
    const result = await this.asignacionRecursosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Asignación de Recurso con ID ${id} no encontrada`);
    }
  }
}