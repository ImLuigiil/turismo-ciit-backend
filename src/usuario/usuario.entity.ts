// src/usuario/usuario.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import * as bcrypt from 'bcryptjs'; // Importa bcryptjs

@Entity('usuario')
export class Usuario {
  @PrimaryColumn({ name: 'id_usuario' })
  idUsuario: number;

  @PrimaryColumn({ name: 'rol_id_rol' })
  rolIdRol: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  nombre: string;

  @Column({ name: 'contraseña', length: 45, nullable: true })
  contrasena: string; // La propiedad que almacena la contraseña hasheada

  @Column({ name: 'correo', length: 45, nullable: true })
  correo: string;

  @Column({ name: 'usuariocol', length: 45, nullable: true })
  usuariocol: string;

  @ManyToOne(() => Rol, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'rol_id_rol', referencedColumnName: 'idRol' })
  rol: Rol;

  // --- Hooks para hashear la contraseña antes de guardar/actualizar ---
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.contrasena) { // Solo hashear si la contraseña está presente
      this.contrasena = await bcrypt.hash(this.contrasena, 10); // 10 es el costo del salt
    }
  }
  // --- Fin Hooks ---
}