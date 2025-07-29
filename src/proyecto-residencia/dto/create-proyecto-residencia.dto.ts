import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProyectoResidenciaDto {
  @IsNumber()
  @IsNotEmpty()
  idResidencia: number;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  nombreAlumno?: string;

  @IsString()
  @IsOptional()
  ciclo?: string;
}