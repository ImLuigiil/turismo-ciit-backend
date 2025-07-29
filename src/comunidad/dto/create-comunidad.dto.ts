import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateComunidadDto {
  @IsNumber()
  @IsNotEmpty()
  idComunidad: number;

  @IsString()
  @IsOptional() 
  nombre?: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsNumber()
  @IsOptional()
  poblacion?: number;
}