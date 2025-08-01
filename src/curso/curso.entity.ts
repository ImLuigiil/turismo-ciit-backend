// src/curso/curso.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn({ name: 'id_curso' })
  idCurso: number;

  @Column({ name: 'nombre', length: 45, nullable: true, type: 'varchar' })
  nombre: string | null;

  @Column({ name: 'tipo', length: 45, nullable: false, type: 'varchar' }) 
  tipo: string;

  @Column({ name: 'link', length: 255, nullable: true, type: 'varchar' })
  link: string | null;
}
