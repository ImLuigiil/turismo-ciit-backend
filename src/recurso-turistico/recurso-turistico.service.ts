import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecursoTuristico } from './recurso-turistico.entity';
import { CreateRecursoTuristicoDto } from './dto/create-recurso-turistico.dto';
import { UpdateRecursoTuristicoDto } from './dto/update-recurso-turistico.dto';

@Injectable()
export class RecursoTuristicoService {
  constructor(
    @InjectRepository(RecursoTuristico)
    private recursosTuristicosRepository: Repository<RecursoTuristico>,
  ) {}

  async create(createRecursoTuristicoDto: CreateRecursoTuristicoDto): Promise<RecursoTuristico> {
    const newRecursoTuristico = this.recursosTuristicosRepository.create(createRecursoTuristicoDto);
    return this.recursosTuristicosRepository.save(newRecursoTuristico);
  }

  async findAll(): Promise<RecursoTuristico[]> {
    return this.recursosTuristicosRepository.find();
  }

  async findOne(
    idRecurso: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number
  ): Promise<RecursoTuristico> {
    const recursoTuristico = await this.recursosTuristicosRepository.findOne({
      where: {
        idRecurso: idRecurso,
        comiteIdComite: comiteId,
        comiteReunionIdReunion: comiteReunionId,
        comiteAsignacionRecursoIdAsg: comiteAsignacionId,
      },
      relations: ['comite'],
    });
    if (!recursoTuristico) {
      throw new NotFoundException(`Recurso Turístico no encontrado con los IDs proporcionados.`);
    }
    return recursoTuristico;
  }

  async update(
    idRecurso: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number,
    updateRecursoTuristicoDto: UpdateRecursoTuristicoDto
  ): Promise<RecursoTuristico> {
    const recursoTuristico = await this.findOne(idRecurso, comiteId, comiteReunionId, comiteAsignacionId);
    this.recursosTuristicosRepository.merge(recursoTuristico, updateRecursoTuristicoDto);
    return this.recursosTuristicosRepository.save(recursoTuristico);
  }

  async remove(
    idRecurso: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number
  ): Promise<void> {
    const result = await this.recursosTuristicosRepository.delete({
      idRecurso: idRecurso,
      comiteIdComite: comiteId,
      comiteReunionIdReunion: comiteReunionId,
      comiteAsignacionRecursoIdAsg: comiteAsignacionId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Recurso Turístico no encontrado con los IDs proporcionados.`);
    }
  }
}