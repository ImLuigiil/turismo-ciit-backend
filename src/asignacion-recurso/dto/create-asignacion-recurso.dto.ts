import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAsignacionRecursoDto {
  @IsNumber()
  @IsNotEmpty()
  idAsg: number;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  tipoAsignador?: string;

  @IsString()
  @IsOptional()
  solicitud?: string;

  @IsNumber()
  @IsOptional()
  solicitudAsignada?: number;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsOptional()
  tiempoAprox?: number;
}