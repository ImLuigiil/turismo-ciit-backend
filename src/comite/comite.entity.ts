import { Entity, PrimaryColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Reunion } from '../reunion/reunion.entity';
import { AsignacionRecurso } from '../asignacion-recurso/asignacion-recurso.entity'; 

@Entity('comite')
export class Comite {
  @PrimaryColumn({ name: 'id_comite' })
  idComite: number;

  @PrimaryColumn({ name: 'reunion_id_reunion' })
  reunionIdReunion: number;

  @PrimaryColumn({ name: 'asignacion_recurso_id_asg' })
  asignacionRecursoIdAsg: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  @Index({ unique: true })
  nombre: string;

  @Column({ name: 'NoMiembros', nullable: true })
  noMiembros: number;

  @Column({ name: 'director_comite', length: 45, nullable: true })
  @Index({ unique: true })
  directorComite: string;

  @ManyToOne(() => Reunion, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'reunion_id_reunion', referencedColumnName: 'idReunion' })
  reunion: Reunion;

  @ManyToOne(() => AsignacionRecurso, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'asignacion_recurso_id_asg', referencedColumnName: 'idAsg' })
  asignacionRecurso: AsignacionRecurso;
}