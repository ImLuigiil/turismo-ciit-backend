import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateComiteDto {
  @IsNumber()
  @IsNotEmpty()
  idComite: number;

  @IsNumber()
  @IsNotEmpty()
  reunionIdReunion: number;

  @IsNumber()
  @IsNotEmpty()
  asignacionRecursoIdAsg: number;

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