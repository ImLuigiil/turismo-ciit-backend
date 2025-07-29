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

  // --- CORRECCIÓN AQUÍ: Añadir 'type: "int"' (o "integer") ---
  @Column({ name: 'poblacion', type: 'int', nullable: true }) // O 'integer', 'numeric'
  poblacion: number | null;
  // --- FIN CORRECCIÓN ---

  @OneToMany(() => Proyecto, proyecto => proyecto.comunidad)
  proyectos: Proyecto[];
}