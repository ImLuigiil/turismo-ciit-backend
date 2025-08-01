import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AsignacionRecursoService } from './asignacion-recurso.service';
import { CreateAsignacionRecursoDto } from './dto/create-asignacion-recurso.dto';
import { UpdateAsignacionRecursoDto } from './dto/update-asignacion-recurso.dto';

@Controller('asignacion-recursos') 
export class AsignacionRecursoController {
  constructor(private readonly asignacionRecursoService: AsignacionRecursoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAsignacionRecursoDto: CreateAsignacionRecursoDto) {
    return this.asignacionRecursoService.create(createAsignacionRecursoDto);
  }

  @Get()
  findAll() {
    return this.asignacionRecursoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asignacionRecursoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAsignacionRecursoDto: UpdateAsignacionRecursoDto) {
    return this.asignacionRecursoService.update(+id, updateAsignacionRecursoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.asignacionRecursoService.remove(+id);
  }
}