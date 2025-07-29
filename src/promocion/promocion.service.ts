import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promocion } from './promocion.entity';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';

@Injectable()
export class PromocionService {
  constructor(
    @InjectRepository(Promocion)
    private promocionesRepository: Repository<Promocion>,
  ) {}

  async create(createPromocionDto: CreatePromocionDto): Promise<Promocion> {
    const newPromocion = this.promocionesRepository.create(createPromocionDto);
    return this.promocionesRepository.save(newPromocion);
  }

  async findAll(): Promise<Promocion[]> {
    return this.promocionesRepository.find();
  }

  async findOne(
    idPromocion: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number
  ): Promise<Promocion> {
    const promocion = await this.promocionesRepository.findOne({
      where: {
        idPromocion: idPromocion,
        comiteIdComite: comiteId,
        comiteReunionIdReunion: comiteReunionId,
        comiteAsignacionRecursoIdAsg: comiteAsignacionId,
      },
      relations: ['comite'],
    });
    if (!promocion) {
      throw new NotFoundException(`Promoción no encontrada con los IDs proporcionados.`);
    }
    return promocion;
  }

  async update(
    idPromocion: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number,
    updatePromocionDto: UpdatePromocionDto
  ): Promise<Promocion> {
    const promocion = await this.findOne(idPromocion, comiteId, comiteReunionId, comiteAsignacionId);
    this.promocionesRepository.merge(promocion, updatePromocionDto);
    return this.promocionesRepository.save(promocion);
  }

  async remove(
    idPromocion: number,
    comiteId: number,
    comiteReunionId: number,
    comiteAsignacionId: number
  ): Promise<void> {
    const result = await this.promocionesRepository.delete({
      idPromocion: idPromocion,
      comiteIdComite: comiteId,
      comiteReunionIdReunion: comiteReunionId,
      comiteAsignacionRecursoIdAsg: comiteAsignacionId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Promoción no encontrada con los IDs proporcionados.`);
    }
  }
}