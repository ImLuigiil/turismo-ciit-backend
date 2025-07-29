// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Crearemos este DTO

@Controller('auth') // Endpoint: /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // Endpoint: /auth/login
  @HttpCode(HttpStatus.OK) // Devuelve 200 OK en caso de éxito
  async login(@Body() loginDto: LoginDto) {
    // Valida usuario y contraseña
    const user = await this.authService.validateUser(loginDto.usuariocol, loginDto.contrasena);
    // Si es válido, genera y devuelve el token
    return this.authService.login(user);
  }
}