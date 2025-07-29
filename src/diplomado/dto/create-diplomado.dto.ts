// src/diplomado/dto/create-diplomado.dto.ts
import { IsNumber, IsString, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateDiplomadoDto {

  @IsString()
  @IsNotEmpty() // Asumimos que el nombre del diplomado sí es obligatorio
  nombre: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsDateString()
  @IsOptional()
  fechaSubida?: Date;
}