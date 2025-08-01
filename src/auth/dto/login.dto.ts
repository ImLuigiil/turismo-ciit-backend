// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  usuariocol: string; 

  @IsString()
  @IsNotEmpty()
  @MinLength(6) 
  contrasena: string;
}