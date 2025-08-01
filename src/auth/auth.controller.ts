// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth') 
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') 
  @HttpCode(HttpStatus.OK) 
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.usuariocol, loginDto.contrasena);
    return this.authService.login(user);
  }
}