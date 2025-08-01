// src/diplomado/dto/create-diplomado.dto.ts
import { IsNumber, IsString, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateDiplomadoDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsDateString()
  @IsOptional()
  fechaSubida?: Date;
}