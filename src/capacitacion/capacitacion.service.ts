// src/capacitacion/capacitacion.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capacitacion } from './capacitacion.entity';
import { CreateCapacitacionDto } from './dto/create-capacitacion.dto';
import { UpdateCapacitacionDto } from './dto/update-capacitacion.dto';

@Injectable()
export class CapacitacionService {
  constructor(
    @InjectRepository(Capacitacion)
    private capacitacionesRepository: Repository<Capacitacion>,
  ) {}

  async create(createCapacitacionDto: CreateCapacitacionDto): Promise<Capacitacion> {
    const newCapacitacion = this.capacitacionesRepository.create(createCapacitacionDto);
    return this.capacitacionesRepository.save(newCapacitacion);
  }

  async findAll(): Promise<Capacitacion[]> {
    return this.capacitacionesRepository.find();
  }

  async findOne(
    idCapacitacion: number,
    comunidadId: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number
  ): Promise<Capacitacion> {
    const capacitacion = await this.capacitacionesRepository.findOne({
      where: {
        idCapacitacion: idCapacitacion,
        comunidadIdComunidad: comunidadId,
        comiteIdComite: comiteId,
        comiteReunionIdReunion: comiteReunionId,
        comiteAsignacionRecursoIdAsg: comiteAsignacionId,
      },
      relations: ['comunidad', 'comite'],
    });
    if (!capacitacion) {
      throw new NotFoundException(`Capacitación no encontrada con los IDs proporcionados.`);
    }
    return capacitacion;
  }

  async update(
    idCapacitacion: number,
    comunidadId: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number,
    updateCapacitacionDto: UpdateCapacitacionDto
  ): Promise<Capacitacion> {
    const capacitacion = await this.findOne(idCapacitacion, comunidadId, comiteId, comiteReunionId, comiteAsignacionId);
    this.capacitacionesRepository.merge(capacitacion, updateCapacitacionDto);
    return this.capacitacionesRepository.save(capacitacion);
  }

  async remove(
    idCapacitacion: number,
    comunidadId: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number
  ): Promise<void> {
    const result = await this.capacitacionesRepository.delete({
      idCapacitacion: idCapacitacion,
      comunidadIdComunidad: comunidadId,
      comiteIdComite: comiteId,
      comiteReunionIdReunion: comiteReunionId,
      comiteAsignacionRecursoIdAsg: comiteAsignacionId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Capacitación no encontrada con los IDs proporcionados.`);
    }
  }
}