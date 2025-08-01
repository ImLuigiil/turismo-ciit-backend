import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CapacitacionService } from './capacitacion.service';
import { CreateCapacitacionDto } from './dto/create-capacitacion.dto';
import { UpdateCapacitacionDto } from './dto/update-capacitacion.dto';

@Controller('capacitaciones') 
export class CapacitacionController {
  constructor(private readonly capacitacionService: CapacitacionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCapacitacionDto: CreateCapacitacionDto) {
    return this.capacitacionService.create(createCapacitacionDto);
  }

  @Get()
  findAll() {
    return this.capacitacionService.findAll();
  }

  @Get(':idCapacitacion/:comunidadId/:comiteId/:comiteReunionId/:comiteAsignacionId')
  findOne(
    @Param('idCapacitacion') idCapacitacion: string,
    @Param('comunidadId') comunidadId: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
  ) {
    return this.capacitacionService.findOne(
      +idCapacitacion,
      +comunidadId,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId
    );
  }

  @Put(':idCapacitacion/:comunidadId/:comiteId/:comiteReunionId/:comiteAsignacionId')
  update(
    @Param('idCapacitacion') idCapacitacion: string,
    @Param('comunidadId') comunidadId: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
    @Body() updateCapacitacionDto: UpdateCapacitacionDto,
  ) {
    return this.capacitacionService.update(
      +idCapacitacion,
      +comunidadId,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId,
      updateCapacitacionDto
    );
  }

  @Delete(':idCapacitacion/:comunidadId/:comiteId/:comiteReunionId/:comiteAsignacionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idCapacitacion') idCapacitacion: string,
    @Param('comunidadId') comunidadId: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
  ) {
    return this.capacitacionService.remove(
      +idCapacitacion,
      +comunidadId,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId
    );
  }
}