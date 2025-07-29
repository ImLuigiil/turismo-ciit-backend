// src/proyecto-imagen/dto/create-proyecto-imagen.dto.ts
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProyectoImagenDto {
  @IsString()
  @IsNotEmpty()
  url: string; // La URL de la imagen (generada por el backend)

  @IsNumber()
  @IsOptional()
  esPrincipal?: number | null;

  @IsNumber()
  @IsOptional()
  orden?: number | null;

  @IsNumber()
  @IsNotEmpty()
  proyectoIdProyecto: number; // El ID del proyecto al que pertenece
}
