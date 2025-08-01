// src/proyecto-imagen/proyecto-imagen.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoImagen } from './proyecto-imagen.entity';
import { CreateProyectoImagenDto } from './dto/create-proyecto-imagen.dto';
import { UpdateProyectoImagenDto } from './dto/update-proyecto-imagen.dto';

@Injectable()
export class ProyectoImagenService {
  constructor(
    @InjectRepository(ProyectoImagen)
    private proyectoImagenesRepository: Repository<ProyectoImagen>,
  ) {}

  async create(createProyectoImagenDto: CreateProyectoImagenDto): Promise<ProyectoImagen> {
    const newImagen = this.proyectoImagenesRepository.create(createProyectoImagenDto);
    return this.proyectoImagenesRepository.save(newImagen);
  }

  async findAll(): Promise<ProyectoImagen[]> {
    return this.proyectoImagenesRepository.find();
  }

  async findOne(id: number): Promise<ProyectoImagen> {
    const imagen = await this.proyectoImagenesRepository.findOne({ where: { idProyectoImagen: id } });
    if (!imagen) {
      throw new NotFoundException(`Imagen con ID ${id} no encontrada`);
    }
    return imagen;
  }

  async findByProyectoId(proyectoId: number): Promise<ProyectoImagen[]> {
    return this.proyectoImagenesRepository.find({ where: { proyectoIdProyecto: proyectoId }, order: { orden: 'ASC', idProyectoImagen: 'ASC' } });
  }

  async update(id: number, updateProyectoImagenDto: UpdateProyectoImagenDto): Promise<ProyectoImagen> {
    const imagen = await this.findOne(id);
    this.proyectoImagenesRepository.merge(imagen, updateProyectoImagenDto);
    return this.proyectoImagenesRepository.save(imagen);
  }

  async remove(id: number): Promise<void> {
    const result = await this.proyectoImagenesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Imagen con ID ${id} no encontrada`);
    }
  }
}
