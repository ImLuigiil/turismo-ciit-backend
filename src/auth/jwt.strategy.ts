// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsuarioService } from '../usuario/usuario.service';
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, 
      secretOrKey: jwtConstants.secret, 
    });
  }

  async validate(payload: any) {
    const user = await this.usuariosRepository.findOne({
        where: { idUsuario: payload.sub, usuariocol: payload.username },
        relations: ['rol'] 
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no válido');
    }

    return user;
  }
}