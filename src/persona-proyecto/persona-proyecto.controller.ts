// src/persona-proyecto/persona-proyecto.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PersonaProyectoService } from './persona-proyecto.service';
import { CreatePersonaProyectoDto } from './dto/create-persona-proyecto.dto';
import { UpdatePersonaProyectoDto } from './dto/update-persona-proyecto.dto';
import { AuthGuard } from '@nestjs/passport'; // Para proteger las rutas

@Controller('personas-proyecto') // Endpoint: /personas-proyecto
export class PersonaProyectoController {
  constructor(private readonly personaProyectoService: PersonaProyectoService) {}

  @UseGuards(AuthGuard('jwt')) // Protege todas las operaciones de modificación
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPersonaProyectoDto: CreatePersonaProyectoDto) {
    return this.personaProyectoService.create(createPersonaProyectoDto);
  }

  @Get() // Acceso público para listar todas las personas (si se requiere)
  findAll() {
    return this.personaProyectoService.findAll();
  }

  @Get('by-project/:proyectoId') // Nuevo endpoint para obtener personas de un proyecto específico
  findByProjectId(@Param('proyectoId') proyectoId: string) {
    return this.personaProyectoService.findByProyectoId(+proyectoId);
  }

  @Get(':id') // Acceso público para ver una persona por ID
  findOne(@Param('id') id: string) {
    return this.personaProyectoService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePersonaProyectoDto: UpdatePersonaProyectoDto) {
    return this.personaProyectoService.update(+id, updatePersonaProyectoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.personaProyectoService.remove(+id);
  }
}