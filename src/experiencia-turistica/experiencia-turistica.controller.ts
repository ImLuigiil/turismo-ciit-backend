import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ExperienciaTuristicaService } from './experiencia-turistica.service';
import { CreateExperienciaTuristicaDto } from './dto/create-experiencia-turistica.dto';
import { UpdateExperienciaTuristicaDto } from './dto/update-experiencia-turistica.dto';

@Controller('experiencias-turisticas') // Endpoint: /experiencias-turisticas
export class ExperienciaTuristicaController {
  constructor(private readonly experienciaTuristicaService: ExperienciaTuristicaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createExperienciaTuristicaDto: CreateExperienciaTuristicaDto) {
    return this.experienciaTuristicaService.create(createExperienciaTuristicaDto);
  }

  @Get()
  findAll() {
    return this.experienciaTuristicaService.findAll();
  }

  // Este endpoint necesita todas las partes de la clave primaria compuesta en la URL
  @Get(':idExperiencia/:comiteId/:comiteReunionId/:comiteAsignacionId/:proyectoId')
  findOne(
    @Param('idExperiencia') idExperiencia: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
    @Param('proyectoId') proyectoId: string,
  ) {
    return this.experienciaTuristicaService.findOne(
      +idExperiencia,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId,
      +proyectoId
    );
  }

  @Put(':idExperiencia/:comiteId/:comiteReunionId/:comiteAsignacionId/:proyectoId')
  update(
    @Param('idExperiencia') idExperiencia: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
    @Param('proyectoId') proyectoId: string,
    @Body() updateExperienciaTuristicaDto: UpdateExperienciaTuristicaDto,
  ) {
    return this.experienciaTuristicaService.update(
      +idExperiencia,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId,
      +proyectoId,
      updateExperienciaTuristicaDto
    );
  }

  @Delete(':idExperiencia/:comiteId/:comiteReunionId/:comiteAsignacionId/:proyectoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idExperiencia') idExperiencia: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
    @Param('proyectoId') proyectoId: string,
  ) {
    return this.experienciaTuristicaService.remove(
      +idExperiencia,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId,
      +proyectoId
    );
  }
}