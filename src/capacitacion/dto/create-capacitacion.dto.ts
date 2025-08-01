import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCapacitacionDto {
  @IsNumber()
  @IsNotEmpty()
  idCapacitacion: number;

  @IsNumber()
  @IsNotEmpty()
  comunidadIdComunidad: number;

  @IsNumber()
  @IsNotEmpty()
  comiteIdComite: number;

  @IsNumber()
  @IsNotEmpty()
  comiteReunionIdReunion: number;

  @IsNumber()
  @IsNotEmpty()
  comiteAsignacionRecursoIdAsg: number;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsNumber()
  @IsOptional()
  duracion?: number;

  @IsString()
  @IsOptional()
  tema?: string;
}