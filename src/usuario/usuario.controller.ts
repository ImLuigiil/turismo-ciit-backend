import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios') // Endpoint: /usuarios
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  // Este endpoint necesita ambas partes de la clave primaria compuesta en la URL
  @Get(':idUsuario/:rolId')
  findOne(
    @Param('idUsuario') idUsuario: string,
    @Param('rolId') rolId: string,
  ) {
    return this.usuarioService.findOne(+idUsuario, +rolId);
  }

  @Put(':idUsuario/:rolId')
  update(
    @Param('idUsuario') idUsuario: string,
    @Param('rolId') rolId: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(+idUsuario, +rolId, updateUsuarioDto);
  }

  @Delete(':idUsuario/:rolId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idUsuario') idUsuario: string,
    @Param('rolId') rolId: string,
  ) {
    return this.usuarioService.remove(+idUsuario, +rolId);
  }
}