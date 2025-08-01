// src/diplomado/diplomado.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('diplomado')
export class Diplomado {
  @PrimaryGeneratedColumn({ name: 'id_diplomado' }) 
  idDiplomado: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  nombre: string;

  @Column({ name: 'link', length: 255, nullable: true })
  link: string;

  @Column({ name: 'fecha_subida', type: 'date', nullable: true })
  fechaSubida: Date;
}