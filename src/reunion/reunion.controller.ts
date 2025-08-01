import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ReunionService } from './reunion.service';
import { CreateReunionDto } from './dto/create-reunion.dto';
import { UpdateReunionDto } from './dto/update-reunion.dto';

@Controller('reuniones')
export class ReunionController {
  constructor(private readonly reunionService: ReunionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReunionDto: CreateReunionDto) {
    return this.reunionService.create(createReunionDto);
  }

  @Get()
  findAll() {
    return this.reunionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reunionService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateReunionDto: UpdateReunionDto) {
    return this.reunionService.update(+id, updateReunionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reunionService.remove(+id);
  }
}