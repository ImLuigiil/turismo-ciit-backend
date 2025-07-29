import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('rol')
export class Rol {
  @PrimaryColumn({ name: 'id_rol' })
  idRol: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  nombre: string;
}