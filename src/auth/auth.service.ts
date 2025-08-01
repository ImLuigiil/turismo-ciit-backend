// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Rol } from '../rol/rol.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
    private jwtService: JwtService,
  ) {}

  async validateUser(usuariocol: string, contrasena: string): Promise<any> {
    const user = await this.usuariosRepository.findOne({
      where: { usuariocol: usuariocol },
      relations: ['rol'] 
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordMatching = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.rol.nombre !== 'administrador') { 
      throw new UnauthorizedException('Acceso denegado: Se requiere rol de administrador');
    }

    
    const { contrasena: userPassword, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      username: user.usuariocol,
      sub: user.idUsuario,
      role: user.rol.nombre 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}