// src/persona-proyecto/dto/update-persona-proyecto.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonaProyectoDto } from './create-persona-proyecto.dto';

export class UpdatePersonaProyectoDto extends PartialType(CreatePersonaProyectoDto) {}