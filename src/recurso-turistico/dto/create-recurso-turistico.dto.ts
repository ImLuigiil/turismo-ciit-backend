import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRecursoTuristicoDto {
  @IsNumber()
  @IsNotEmpty()
  idRecurso: number;

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

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsOptional()
  tiempoAprox?: number;
}