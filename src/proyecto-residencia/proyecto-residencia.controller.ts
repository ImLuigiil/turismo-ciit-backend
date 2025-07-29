import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProyectoResidenciaService } from './proyecto-residencia.service';
import { CreateProyectoResidenciaDto } from './dto/create-proyecto-residencia.dto';
import { UpdateProyectoResidenciaDto } from './dto/update-proyecto-residencia.dto';

@Controller('proyectos-residencia') // Endpoint: /proyectos-residencia
export class ProyectoResidenciaController {
  constructor(private readonly proyectoResidenciaService: ProyectoResidenciaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProyectoResidenciaDto: CreateProyectoResidenciaDto) {
    return this.proyectoResidenciaService.create(createProyectoResidenciaDto);
  }

  @Get()
  findAll() {
    return this.proyectoResidenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectoResidenciaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProyectoResidenciaDto: UpdateProyectoResidenciaDto) {
    return this.proyectoResidenciaService.update(+id, updateProyectoResidenciaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.proyectoResidenciaService.remove(+id);
  }
}