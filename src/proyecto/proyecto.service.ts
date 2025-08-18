// src/proyecto/proyecto.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { ProyectoImagen } from '../proyecto-imagen/proyecto-imagen.entity';

@Injectable()
export class ProyectoService {
  private readonly MAX_NAME_CHANGES = 3;

  constructor(
    @InjectRepository(Proyecto)
    private proyectosRepository: Repository<Proyecto>,
    @InjectRepository(ProyectoImagen)
    private proyectoImagenesRepository: Repository<ProyectoImagen>,
  ) {}

  async createProjectWithImages(createProyectoDto: CreateProyectoDto, imagenesData: Partial<ProyectoImagen>[]): Promise<Proyecto> {
    const newProyecto = this.proyectosRepository.create({
      ...createProyectoDto,
      nombreCambiosCount: 0,
    });

    const savedProyecto = await this.proyectosRepository.save(newProyecto);

    if (imagenesData && imagenesData.length > 0) {
      const imagenesEntities = imagenesData.map(img => this.proyectoImagenesRepository.create({
        ...img,
        proyecto: savedProyecto,
        proyectoIdProyecto: savedProyecto.idProyecto,
      }));
      await this.proyectoImagenesRepository.save(imagenesEntities);
      savedProyecto.imagenes = imagenesEntities;
    }

    return savedProyecto;
  }

  async findAll(): Promise<Proyecto[]> {
    return this.proyectosRepository.find({ relations: ['comunidad', 'imagenes'] });
  }

  async findOne(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectosRepository.findOne({
      where: { idProyecto: id },
      relations: ['comunidad', 'personasDirectorio', 'imagenes']
    });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    return proyecto;
  }

  async updateProjectWithImages(
    id: number,
    updateProyectoDto: UpdateProyectoDto,
    newImagesData: Partial<ProyectoImagen>[],
    imagesToDeleteIds?: number[],
    imagesToUpdateData?: Partial<ProyectoImagen>[]
  ): Promise<Proyecto> {
    const existingProyecto = await this.proyectosRepository.findOne({ where: { idProyecto: id } });
    if (!existingProyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado para actualizar.`);
    }

    if (updateProyectoDto.nombre && updateProyectoDto.nombre !== existingProyecto.nombre) {
      if (existingProyecto.nombreCambiosCount >= this.MAX_NAME_CHANGES) {
        throw new BadRequestException(`El nombre del proyecto ya ha sido cambiado el máximo de ${this.MAX_NAME_CHANGES} veces.`);
      }
      existingProyecto.nombreCambiosCount += 1;
    }

    this.proyectosRepository.merge(existingProyecto, updateProyectoDto);

    if (imagesToDeleteIds && imagesToDeleteIds.length > 0) {
      await this.proyectoImagenesRepository.delete(imagesToDeleteIds);
    }

    if (imagesToUpdateData && imagesToUpdateData.length > 0) {
      for (const imgData of imagesToUpdateData) {
        if (imgData.idProyectoImagen) {
          const existingImage = await this.proyectoImagenesRepository.findOne({ where: { idProyectoImagen: imgData.idProyectoImagen } });
          if (existingImage) {
            this.proyectoImagenesRepository.merge(existingImage, imgData);
            await this.proyectoImagenesRepository.save(existingImage);
          }
        }
      }
    }

    if (newImagesData && newImagesData.length > 0) {
      const newImagesEntities = newImagesData.map(img => this.proyectoImagenesRepository.create({
        ...img,
        proyecto: existingProyecto,
        proyectoIdProyecto: existingProyecto.idProyecto,
      }));
      await this.proyectoImagenesRepository.save(newImagesEntities);
    }

    const savedProyecto = await this.proyectosRepository.save(existingProyecto);
    return this.findOne(savedProyecto.idProyecto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.proyectosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
  }

  async getProjectReportData(id: number): Promise<Proyecto> {
    const project = await this.findOne(id);
    return project;
  }

  // --- NUEVO MÉTODO: Concluir Fase ---
  async concluirFase(
    id: number,
    justificacion: string,
    documentoUrl: string | null
  ): Promise<Proyecto> {
    const project = await this.proyectosRepository.findOne({ where: { idProyecto: id } });

    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado.`);
    }

    if (project.faseActual = 7) {
      throw new BadRequestException('El proyecto ya ha alcanzado la fase final (7) o superior.');
    }

    // Incrementar la fase actual
    project.faseActual += 1;
    // Guardar la justificación y la URL del documento
    project.justificacionFase = justificacion;
    project.justificacionDocumentoUrl = documentoUrl;

    // Guardar los cambios en la base de datos
    return this.proyectosRepository.save(project);
  }
  // --- FIN NUEVO MÉTODO ---
}
