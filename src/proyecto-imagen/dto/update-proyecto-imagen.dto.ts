// src/proyecto-imagen/dto/update-proyecto-imagen.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectoImagenDto } from './create-proyecto-imagen.dto';

export class UpdateProyectoImagenDto extends PartialType(CreateProyectoImagenDto) {}
