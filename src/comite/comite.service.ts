import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comite } from './comite.entity';
import { CreateComiteDto } from './dto/create-comite.dto';
import { UpdateComiteDto } from './dto/update-comite.dto';

@Injectable()
export class ComiteService {
  constructor(
    @InjectRepository(Comite)
    private comitesRepository: Repository<Comite>,
  ) {}

  async create(createComiteDto: CreateComiteDto): Promise<Comite> {
    const newComite = this.comitesRepository.create(createComiteDto);
    return this.comitesRepository.save(newComite);
  }

  async findAll(): Promise<Comite[]> {
    return this.comitesRepository.find();
  }

  async findOne(idComite: number, reunionId: number, asignacionId: number): Promise<Comite> {
    const comite = await this.comitesRepository.findOne({
      where: {
        idComite: idComite,
        reunionIdReunion: reunionId,
        asignacionRecursoIdAsg: asignacionId,
      },
      relations: ['reunion', 'asignacionRecurso'], 
    });
    if (!comite) {
      throw new NotFoundException(`Comité con ID ${idComite}, Reunión ID ${reunionId}, Asignación ID ${asignacionId} no encontrado`);
    }
    return comite;
  }

  async update(idComite: number, reunionId: number, asignacionId: number, updateComiteDto: UpdateComiteDto): Promise<Comite> {
    const comite = await this.findOne(idComite, reunionId, asignacionId);
    this.comitesRepository.merge(comite, updateComiteDto);
    return this.comitesRepository.save(comite);
  }

  async remove(idComite: number, reunionId: number, asignacionId: number): Promise<void> {
    const result = await this.comitesRepository.delete({
      idComite: idComite,
      reunionIdReunion: reunionId,
      asignacionRecursoIdAsg: asignacionId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Comité con ID ${idComite}, Reunión ID ${reunionId}, Asignación ID ${asignacionId} no encontrado`);
    }
  }
}