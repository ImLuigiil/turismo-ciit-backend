// src/proyecto-imagen/proyecto-imagen.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ProyectoImagenService } from './proyecto-imagen.service';
import { CreateProyectoImagenDto } from './dto/create-proyecto-imagen.dto';
import { UpdateProyectoImagenDto } from './dto/update-proyecto-imagen.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('proyecto-imagenes') // Endpoint: /proyecto-imagenes
export class ProyectoImagenController {
  constructor(private readonly proyectoImagenService: ProyectoImagenService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProyectoImagenDto: CreateProyectoImagenDto) {
    return this.proyectoImagenService.create(createProyectoImagenDto);
  }

  @Get()
  findAll() {
    return this.proyectoImagenService.findAll();
  }

  @Get('by-project/:proyectoId') // Endpoint para obtener imágenes por ID de proyecto
  findByProjectId(@Param('proyectoId') proyectoId: string) {
    return this.proyectoImagenService.findByProyectoId(+proyectoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectoImagenService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProyectoImagenDto: UpdateProyectoImagenDto) {
    return this.proyectoImagenService.update(+id, updateProyectoImagenDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.proyectoImagenService.remove(+id);
  }
}
