import { IsNumber, IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;

  @IsNumber()
  @IsNotEmpty()
  rolIdRol: number; // Necesario para la clave primaria compuesta y la FK

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  @MinLength(6) // Ejemplo: Añadir una validación de longitud mínima para la contraseña
  contrasena?: string;

  @IsString()
  @IsOptional()
  // @IsEmail() // Podrías añadir esta validación si quieres asegurar que es un email válido
  correo?: string;

  @IsString()
  @IsOptional()
  usuariocol?: string; // Revisa si es el nombre correcto del campo de usuario
}