// src/persona-proyecto/persona-proyecto.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonaProyecto } from './persona-proyecto.entity';
import { CreatePersonaProyectoDto } from './dto/create-persona-proyecto.dto';
import { UpdatePersonaProyectoDto } from './dto/update-persona-proyecto.dto';

@Injectable()
export class PersonaProyectoService {
  constructor(
    @InjectRepository(PersonaProyecto)
    private personasProyectoRepository: Repository<PersonaProyecto>,
  ) {}

  async create(createPersonaProyectoDto: CreatePersonaProyectoDto): Promise<PersonaProyecto> {
    const newPersona = this.personasProyectoRepository.create(createPersonaProyectoDto);
    return this.personasProyectoRepository.save(newPersona);
  }

  async findAll(): Promise<PersonaProyecto[]> {
    return this.personasProyectoRepository.find({ relations: ['proyecto'] });
  }

  async findOne(id: number): Promise<PersonaProyecto> {
    const persona = await this.personasProyectoRepository.findOne({ where: { idPersonaProyecto: id }, relations: ['proyecto'] });
    if (!persona) {
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);
    }
    return persona;
  }

  // Encontrar personas por ID de proyecto
  async findByProyectoId(proyectoId: number): Promise<PersonaProyecto[]> {
    return this.personasProyectoRepository.find({ where: { proyectoIdProyecto: proyectoId } });
  }

  async update(id: number, updatePersonaProyectoDto: UpdatePersonaProyectoDto): Promise<PersonaProyecto> {
    const persona = await this.findOne(id);
    this.personasProyectoRepository.merge(persona, updatePersonaProyectoDto);
    return this.personasProyectoRepository.save(persona);
  }

  async remove(id: number): Promise<void> {
    const result = await this.personasProyectoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);
    }
  }
}