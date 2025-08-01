import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('asignacion_recurso')
export class AsignacionRecurso {
  @PrimaryColumn({ name: 'id_asg' })
  idAsg: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  nombre: string;

  @Column({ name: 'tipo_asignador', length: 45, nullable: true })
  tipoAsignador: string;

  @Column({ name: 'solicitud', length: 45, nullable: true })
  solicitud: string;

  @Column({ name: 'solicitud_asignada', nullable: true })
  solicitudAsignada: number;

  @Column({ name: 'status', type: 'tinyint', nullable: true })
  status: number;

  @Column({ name: 'tiempo_aprox', nullable: true })
  tiempoAprox: number;
}