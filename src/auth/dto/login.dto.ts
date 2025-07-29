// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  usuariocol: string; // El campo de nombre de usuario en tu tabla

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Ajusta la longitud mínima si es necesario
  contrasena: string; // La contraseña en texto plano que envía el usuario
}