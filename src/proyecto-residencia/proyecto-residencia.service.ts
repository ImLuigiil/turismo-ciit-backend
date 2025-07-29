import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoResidencia } from './proyecto-residencia.entity';
import { CreateProyectoResidenciaDto } from './dto/create-proyecto-residencia.dto';
import { UpdateProyectoResidenciaDto } from './dto/update-proyecto-residencia.dto';

@Injectable()
export class ProyectoResidenciaService {
  constructor(
    @InjectRepository(ProyectoResidencia)
    private proyectosResidenciaRepository: Repository<ProyectoResidencia>,
  ) {}

  async create(createProyectoResidenciaDto: CreateProyectoResidenciaDto): Promise<ProyectoResidencia> {
    const newProyectoResidencia = this.proyectosResidenciaRepository.create(createProyectoResidenciaDto);
    return this.proyectosResidenciaRepository.save(newProyectoResidencia);
  }

  async findAll(): Promise<ProyectoResidencia[]> {
    return this.proyectosResidenciaRepository.find();
  }

  async findOne(id: number): Promise<ProyectoResidencia> {
    const proyectoResidencia = await this.proyectosResidenciaRepository.findOne({ where: { idResidencia: id } });
    if (!proyectoResidencia) {
      throw new NotFoundException(`Proyecto de Residencia con ID ${id} no encontrado`);
    }
    return proyectoResidencia;
  }

  async update(id: number, updateProyectoResidenciaDto: UpdateProyectoResidenciaDto): Promise<ProyectoResidencia> {
    const proyectoResidencia = await this.findOne(id);
    this.proyectosResidenciaRepository.merge(proyectoResidencia, updateProyectoResidenciaDto);
    return this.proyectosResidenciaRepository.save(proyectoResidencia);
  }

  async remove(id: number): Promise<void> {
    const result = await this.proyectosResidenciaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Proyecto de Residencia con ID ${id} no encontrado`);
    }
  }
}