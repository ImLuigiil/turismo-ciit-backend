import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import * as bcrypt from 'bcryptjs'; 

@Entity('usuario')
export class Usuario {
  @PrimaryColumn({ name: 'id_usuario' })
  idUsuario: number;

  @PrimaryColumn({ name: 'rol_id_rol' })
  rolIdRol: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  nombre: string;

  @Column({ name: 'contraseña', length: 45, nullable: true })
  contrasena: string; 

  @Column({ name: 'correo', length: 45, nullable: true })
  correo: string;

  @Column({ name: 'usuariocol', length: 45, nullable: true })
  usuariocol: string;

  @ManyToOne(() => Rol, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'rol_id_rol', referencedColumnName: 'idRol' })
  rol: Rol;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.contrasena) { 
      this.contrasena = await bcrypt.hash(this.contrasena, 10); 
    }
  }

}