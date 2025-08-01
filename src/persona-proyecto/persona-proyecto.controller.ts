// src/persona-proyecto/persona-proyecto.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PersonaProyectoService } from './persona-proyecto.service';
import { CreatePersonaProyectoDto } from './dto/create-persona-proyecto.dto';
import { UpdatePersonaProyectoDto } from './dto/update-persona-proyecto.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('personas-proyecto') 
export class PersonaProyectoController {
  constructor(private readonly personaProyectoService: PersonaProyectoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPersonaProyectoDto: CreatePersonaProyectoDto) {
    return this.personaProyectoService.create(createPersonaProyectoDto);
  }

  @Get() 
  findAll() {
    return this.personaProyectoService.findAll();
  }

  @Get('by-project/:proyectoId')
  findByProjectId(@Param('proyectoId') proyectoId: string) {
    return this.personaProyectoService.findByProyectoId(+proyectoId);
  }

  @Get(':id') 
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