import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PromocionService } from './promocion.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';

@Controller('promociones') // Endpoint: /promociones
export class PromocionController {
  constructor(private readonly promocionService: PromocionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPromocionDto: CreatePromocionDto) {
    return this.promocionService.create(createPromocionDto);
  }

  @Get()
  findAll() {
    return this.promocionService.findAll();
  }

  // Este endpoint necesita todas las partes de la clave primaria compuesta en la URL
  @Get(':idPromocion/:comiteId/:comiteReunionId/:comiteAsignacionId')
  findOne(
    @Param('idPromocion') idPromocion: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
  ) {
    return this.promocionService.findOne(
      +idPromocion,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId
    );
  }

  @Put(':idPromocion/:comiteId/:comiteReunionId/:comiteAsignacionId')
  update(
    @Param('idPromocion') idPromocion: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
    @Body() updatePromocionDto: UpdatePromocionDto,
  ) {
    return this.promocionService.update(
      +idPromocion,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId,
      updatePromocionDto
    );
  }

  @Delete(':idPromocion/:comiteId/:comiteReunionId/:comiteAsignacionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idPromocion') idPromocion: string,
    @Param('comiteId') comiteId: string,
    @Param('comiteReunionId') comiteReunionId: string,
    @Param('comiteAsignacionId') comiteAsignacionId: string,
  ) {
    return this.promocionService.remove(
      +idPromocion,
      +comiteId,
      +comiteReunionId,
      +comiteAsignacionId
    );
  }
}