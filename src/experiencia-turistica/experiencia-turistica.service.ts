import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperienciaTuristica } from './experiencia-turistica.entity';
import { CreateExperienciaTuristicaDto } from './dto/create-experiencia-turistica.dto';
import { UpdateExperienciaTuristicaDto } from './dto/update-experiencia-turistica.dto';

@Injectable()
export class ExperienciaTuristicaService {
  constructor(
    @InjectRepository(ExperienciaTuristica)
    private experienciasTuristicasRepository: Repository<ExperienciaTuristica>,
  ) {}

  async create(createExperienciaTuristicaDto: CreateExperienciaTuristicaDto): Promise<ExperienciaTuristica> {
    const newExperienciaTuristica = this.experienciasTuristicasRepository.create(createExperienciaTuristicaDto);
    return this.experienciasTuristicasRepository.save(newExperienciaTuristica);
  }

  async findAll(): Promise<ExperienciaTuristica[]> {
    return this.experienciasTuristicasRepository.find();
  }

  async findOne(
    idExperiencia: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number,
    proyectoId: number
  ): Promise<ExperienciaTuristica> {
    const experienciaTuristica = await this.experienciasTuristicasRepository.findOne({
      where: {
        idExperiencia: idExperiencia,
        comiteIdComite: comiteId,
        comiteReunionIdReunion: comiteReunionId,
        comiteAsignacionRecursoIdAsg: comiteAsignacionId,
        proyectoIdProyecto: proyectoId,
      },
      relations: ['comite', 'proyecto'],
    });
    if (!experienciaTuristica) {
      throw new NotFoundException(`Experiencia Turística no encontrada con los IDs proporcionados.`);
    }
    return experienciaTuristica;
  }

  async update(
    idExperiencia: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number,
    proyectoId: number,
    updateExperienciaTuristicaDto: UpdateExperienciaTuristicaDto
  ): Promise<ExperienciaTuristica> {
    const experienciaTuristica = await this.findOne(idExperiencia, comiteId, comiteReunionId, comiteAsignacionId, proyectoId);
    this.experienciasTuristicasRepository.merge(experienciaTuristica, updateExperienciaTuristicaDto);
    return this.experienciasTuristicasRepository.save(experienciaTuristica);
  }

  async remove(
    idExperiencia: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number,
    proyectoId: number
  ): Promise<void> {
    const result = await this.experienciasTuristicasRepository.delete({
      idExperiencia: idExperiencia,
      comiteIdComite: comiteId,
      comiteReunionIdReunion: comiteReunionId,
      comiteAsignacionRecursoIdAsg: comiteAsignacionId,
      proyectoIdProyecto: proyectoId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Experiencia Turística no encontrada con los IDs proporcionados.`);
    }
  }
}