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
    @InjectRepository(Rol) // Inyecta el repositorio de Rol
    private rolesRepository: Repository<Rol>,
    private jwtService: JwtService,
  ) {}

  async validateUser(usuariocol: string, contrasena: string): Promise<any> {
    // Busca al usuario por su usuariocol (nombre de usuario)
    const user = await this.usuariosRepository.findOne({
      where: { usuariocol: usuariocol },
      relations: ['rol'] // Necesitamos el rol para verificar si es administrador
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Compara la contraseña proporcionada con la hasheada en la DB
    const isPasswordMatching = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Asegúrate de que el rol sea "administrador"
    if (user.rol.nombre !== 'administrador') { // Asumiendo que tienes un rol llamado 'administrador'
      throw new UnauthorizedException('Acceso denegado: Se requiere rol de administrador');
    }

    // Si todo es correcto, devuelve un objeto con los datos del usuario (sin la contraseña)
    // para que se pueda usar para generar el JWT.
    const { contrasena: userPassword, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      username: user.usuariocol,
      sub: user.idUsuario,
      role: user.rol.nombre // Incluye el rol en el payload del JWT
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}