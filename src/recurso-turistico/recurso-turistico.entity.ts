import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Comite } from '../comite/comite.entity';

@Entity('recurso_turistico')
export class RecursoTuristico {
  @PrimaryColumn({ name: 'id_recurso' })
  idRecurso: number;

  // Partes de la clave primaria compuesta y claves foráneas
  @PrimaryColumn({ name: 'comite_id_comite' })
  comiteIdComite: number;

  @PrimaryColumn({ name: 'comite_reunion_id_reunion' })
  comiteReunionIdReunion: number;

  @PrimaryColumn({ name: 'comite_asignacion_recurso_id_asg' })
  comiteAsignacionRecursoIdAsg: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  nombre: string;

  @Column({ name: 'tipo', length: 45, nullable: true })
  tipo: string;

  @Column({ name: 'descripcion', length: 45, nullable: true })
  descripcion: string;

  @Column({ name: 'status', type: 'tinyint', nullable: true })
  status: number; // O boolean

  @Column({ name: 'tiempo_aprox', nullable: true })
  tiempoAprox: number;

  // Relación Many-to-One con Comite (clave compuesta)
  @ManyToOne(() => Comite, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn([
    { name: 'comite_id_comite', referencedColumnName: 'idComite' },
    { name: 'comite_reunion_id_reunion', referencedColumnName: 'reunionIdReunion' },
    { name: 'comite_asignacion_recurso_id_asg', referencedColumnName: 'asignacionRecursoIdAsg' }
  ])
  comite: Comite;
}