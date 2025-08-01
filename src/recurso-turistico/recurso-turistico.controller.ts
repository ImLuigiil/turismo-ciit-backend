import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { RecursoTuristicoService } from './recurso-turistico.service';
import { CreateRecursoTuristicoDto } from './dto/create-recurso-turistico.dto';
import { UpdateRecursoTuristicoDto } from './dto/update-recurso-turistico.dto';

@Controller('recursos-turisticos')
export class RecursoTuristicoController {
  constructor(private readonly recursoTuristicoService: RecursoTuristicoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRecursoTuristicoDto: CreateRecursoTuristicoDto) {
    return this.recursoTuristicoService.create(createRecursoTuristicoDto);
  }

  @Get()
  findAll() {
    return this.recursoTuristicoService.findAll();
  }

  @Get(':idRecurso/:comiteId/:comiteReunionId/:comiteAsignacionId')
  findOne(
    @Param('idRecurso') idRecurso: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
  ) {
    return this.recursoTuristicoService.findOne(
      +idRecurso,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId
    );
  }

  @Put(':idRecurso/:comiteId/:comiteReunionId/:comiteAsignacionId')
  update(
    @Param('idRecurso') idRecurso: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
    @Body() updateRecursoTuristicoDto: UpdateRecursoTuristicoDto,
  ) {
    return this.recursoTuristicoService.update(
      +idRecurso,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId,
      updateRecursoTuristicoDto
    );
  }

  @Delete(':idRecurso/:comiteId/:comiteReunionId/:comiteAsignacionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idRecurso') idRecurso: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
  ) {
    return this.recursoTuristicoService.remove(
      +idRecurso,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId
    );
  }
}