import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('reunion')
export class Reunion {
  @PrimaryColumn({ name: 'id_reunion' })
  idReunion: number;

  @Column({ name: 'fecha', type: 'date', nullable: true })
  @Index({ unique: true }) 
  fecha: Date;

  @Column({ name: 'hora', nullable: true })
  hora: number;

  @Column({ name: 'lugar', length: 45, nullable: true })
  lugar: string;

  @Column({ name: 'tema', length: 45, nullable: true })
  tema: string;

  @Column({ name: 'status', type: 'tinyint', nullable: true })
  status: number;
}
