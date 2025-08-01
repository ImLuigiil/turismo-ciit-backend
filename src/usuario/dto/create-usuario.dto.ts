import { IsNumber, IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;

  @IsNumber()
  @IsNotEmpty()
  rolIdRol: number; 

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  @MinLength(6) 
  contrasena?: string;

  @IsString()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  usuariocol?: string;
}