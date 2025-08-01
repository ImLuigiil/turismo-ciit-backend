// src/persona-proyecto/dto/create-persona-proyecto.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePersonaProyectoDto {
  @IsString()
  @IsNotEmpty()
  apellidoPaterno: string;

  @IsString()
  @IsOptional()
  apellidoMaterno?: string | null;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  rolEnProyecto?: string | null;

  @IsString()
  @IsOptional()
  contacto?: string | null;

  @IsNumber()
  @IsNotEmpty()
  proyectoIdProyecto: number;
}
