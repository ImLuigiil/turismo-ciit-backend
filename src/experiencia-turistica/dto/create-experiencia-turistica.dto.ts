import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateExperienciaTuristicaDto {
  @IsNumber()
  @IsNotEmpty()
  idExperiencia: number;

  @IsNumber()
  @IsNotEmpty()
  comiteIdComite: number;

  @IsNumber()
  @IsNotEmpty()
  comiteReunionIdReunion: number;

  @IsNumber()
  @IsNotEmpty()
  comiteAsignacionRecursoIdAsg: number; 

  @IsNumber()
  @IsNotEmpty()
  proyectoIdProyecto: number;

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

  @IsString()
  @IsOptional()
  valorAgregado?: string;
}