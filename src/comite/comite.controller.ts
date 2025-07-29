import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ComiteService } from './comite.service';
import { CreateComiteDto } from './dto/create-comite.dto';
import { UpdateComiteDto } from './dto/update-comite.dto';

@Controller('comites') // Endpoint: /comites
export class ComiteController {
  constructor(private readonly comiteService: ComiteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createComiteDto: CreateComiteDto) {
    return this.comiteService.create(createComiteDto);
  }

  @Get()
  findAll() {
    return this.comiteService.findAll();
  }

  @Get(':idComite/:reunionId/:asignacionId')
  findOne(
    @Param('idComite') idComite: string,
    @Param('reunionId') reunionId: string,
    @Param('asignacionId') asignacionId: string,
  ) {
    return this.comiteService.findOne(+idComite, +reunionId, +asignacionId);
  }

  @Put(':idComite/:reunionId/:asignacionId')
  update(
    @Param('idComite') idComite: string,
    @Param('reunionId') reunionId: string,
    @Param('asignacionId') asignacionId: string,
    @Body() updateComiteDto: UpdateComiteDto,
  ) {
    return this.comiteService.update(+idComite, +reunionId, +asignacionId, updateComiteDto);
  }

  @Delete(':idComite/:reunionId/:asignacionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idComite') idComite: string,
    @Param('reunionId') reunionId: string,
    @Param('asignacionId') asignacionId: string,
  ) {
    return this.comiteService.remove(+idComite, +reunionId, +asignacionId);
  }
}