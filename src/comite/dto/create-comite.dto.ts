import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateComiteDto {
  @IsNumber()
  @IsNotEmpty()
  idComite: number;

  @IsNumber()
  @IsNotEmpty()
  reunionIdReunion: number; // Necesario para la clave primaria compuesta y la FK

  @IsNumber()
  @IsNotEmpty()
  asignacionRecursoIdAsg: number; // Necesario para la clave primaria compuesta y la FK

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsNumber()
  @IsOptional()
  noMiembros?: number;

  @IsString()
  @IsOptional()
  directorComite?: string;
}