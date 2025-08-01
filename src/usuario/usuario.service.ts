import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const newUsuario = this.usuariosRepository.create(createUsuarioDto);
    return this.usuariosRepository.save(newUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }


  async findOne(idUsuario: number, rolId: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: {
        idUsuario: idUsuario,
        rolIdRol: rolId,
      },
      relations: ['rol'], 
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${idUsuario} y Rol ID ${rolId} no encontrado`);
    }
    return usuario;
  }

  async update(idUsuario: number, rolId: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(idUsuario, rolId);
    this.usuariosRepository.merge(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(idUsuario: number, rolId: number): Promise<void> {
    const result = await this.usuariosRepository.delete({
      idUsuario: idUsuario,
      rolIdRol: rolId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${idUsuario} y Rol ID ${rolId} no encontrado`);
    }
  }
}