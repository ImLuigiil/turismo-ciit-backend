// src/proyecto/dto/create-proyecto.dto.ts
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsDateString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string | null;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  comunidadIdComunidad?: number | null;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'El número de capítulos no puede ser menor a 1.' })
  @Max(5, { message: 'El número de capítulos no puede ser mayor a 3.' })
  @Type(() => Number)
  noCapitulos?: number | null;

  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  fechaInicio?: Date | null;

  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  fechaFinAprox?: Date | null;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  faseActual?: number | null;

  @IsString()
  @IsOptional()
  imagenUrl?: string | null;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'La población beneficiada no puede ser negativa.' })
  @Type(() => Number)
  poblacionBeneficiada?: number | null;

  @IsString()
  @IsOptional()
  justificacionFase?: string | null;

  @IsString()
  @IsOptional()
  justificacionDocumentoUrl?: string | null;

}
