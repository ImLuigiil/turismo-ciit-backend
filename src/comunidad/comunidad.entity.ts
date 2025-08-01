// src/comunidad/comunidad.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { Proyecto } from '../proyecto/proyecto.entity';

@Entity('comunidad')
export class Comunidad {
  @PrimaryGeneratedColumn({ name: 'id_comunidad' })
  idComunidad: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  @Index({ unique: true })
  nombre: string;

  @Column({ name: 'ubicacion', length: 45, nullable: true })
  @Index({ unique: true })
  ubicacion: string;

  @Column({ name: 'poblacion', type: 'int', nullable: true }) 
  poblacion: number | null;


  @OneToMany(() => Proyecto, proyecto => proyecto.comunidad)
  proyectos: Proyecto[];
}