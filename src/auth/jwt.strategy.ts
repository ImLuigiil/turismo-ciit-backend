// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsuarioService } from '../usuario/usuario.service'; // Necesitamos el servicio de usuario
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header 'Authorization: Bearer <token>'
      ignoreExpiration: false, // No ignorar la expiración del token
      secretOrKey: jwtConstants.secret, // Clave secreta para verificar el token
    });
  }

  // Este método se ejecuta después de que el token es validado y decodificado
  async validate(payload: any) {
    // payload contiene los datos que pusimos en el token (userId, username, etc.)
    // Aquí puedes buscar al usuario en la DB para asegurarte de que existe y está activo
    const user = await this.usuariosRepository.findOne({
        where: { idUsuario: payload.sub, usuariocol: payload.username }, // Asegúrate de que el 'sub' del payload coincida con idUsuario
        relations: ['rol'] // Carga el rol para verificación de autorización
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no válido');
    }

    // Devolvemos el usuario, que se adjuntará a req.user en los controladores
    return user;
  }
}