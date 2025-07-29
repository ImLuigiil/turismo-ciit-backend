import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Comite } from '../comite/comite.entity';
import { Proyecto } from '../proyecto/proyecto.entity';

@Entity('experiencia_turistica')
export class ExperienciaTuristica {
  @PrimaryColumn({ name: 'id_experiencia' })
  idExperiencia: number;

  // Partes de la clave primaria compuesta y claves foráneas
  @PrimaryColumn({ name: 'comite_id_comite' })
  comiteIdComite: number;

  @PrimaryColumn({ name: 'comite_reunion_id_reunion' })
  comiteReunionIdReunion: number;

  @PrimaryColumn({ name: 'comite_asignacion_recurso_id_asg' })
  comiteAsignacionRecursoIdAsg: number;

  @PrimaryColumn({ name: 'proyecto_id_proyecto' })
  proyectoIdProyecto: number;

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

  @Column({ name: 'valor_agregado', length: 45, nullable: true })
  valorAgregado: string;

  // Relación Many-to-One con Comite
  @ManyToOne(() => Comite, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn([
    { name: 'comite_id_comite', referencedColumnName: 'idComite' },
    { name: 'comite_reunion_id_reunion', referencedColumnName: 'reunionIdReunion' },
    { name: 'comite_asignacion_recurso_id_asg', referencedColumnName: 'asignacionRecursoIdAsg' }
  ])
  comite: Comite;

  // Relación Many-to-One con Proyecto
  @ManyToOne(() => Proyecto, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'proyecto_id_proyecto', referencedColumnName: 'idProyecto' })
  proyecto: Proyecto;
}