import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('reunion')
export class Reunion {
  @PrimaryColumn({ name: 'id_reunion' })
  idReunion: number;

  @Column({ name: 'fecha', type: 'date', nullable: true })
  @Index({ unique: true }) // Agrega el índice único basado en tu SQL
  fecha: Date;

  @Column({ name: 'hora', nullable: true })
  hora: number; // Asumiendo que 'hora' es un entero para representar la hora (ej., 14 para 2 PM)

  @Column({ name: 'lugar', length: 45, nullable: true })
  lugar: string;

  @Column({ name: 'tema', length: 45, nullable: true })
  tema: string;

  @Column({ name: 'status', type: 'tinyint', nullable: true })
  status: number; // O boolean si solo es 0 o 1
}
