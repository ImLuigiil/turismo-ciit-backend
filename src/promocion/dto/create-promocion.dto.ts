import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePromocionDto {
  @IsNumber()
  @IsNotEmpty()
  idPromocion: number;

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
  descripcion?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsNumber()
  @IsOptional()
  status?: number;
}