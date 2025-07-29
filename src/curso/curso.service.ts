// src/curso/curso.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private cursosRepository: Repository<Curso>,
  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const newCurso = this.cursosRepository.create(createCursoDto);
    return this.cursosRepository.save(newCurso);
  }

  async findAll(): Promise<Curso[]> {
    return this.cursosRepository.find();
  }

  async findOne(id: number): Promise<Curso> {
    const curso = await this.cursosRepository.findOne({ where: { idCurso: id } });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  async update(id: number, updateCursoDto: UpdateCursoDto): Promise<Curso> {
    const curso = await this.findOne(id);
    this.cursosRepository.merge(curso, updateCursoDto);
    return this.cursosRepository.save(curso);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cursosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
  }
}
