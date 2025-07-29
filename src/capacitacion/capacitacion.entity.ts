// src/capacitacion/capacitacion.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Comunidad } from '../comunidad/comunidad.entity';
import { Comite } from '../comite/comite.entity';

@Entity('capacitacion')
export class Capacitacion {
  @PrimaryColumn({ name: 'id_capacitacion' })
  idCapacitacion: number;

  @PrimaryColumn({ name: 'comunidad_id_comunidad' })
  comunidadIdComunidad: number;

  @PrimaryColumn({ name: 'comite_id_comite' })
  comiteIdComite: number;

  @PrimaryColumn({ name: 'comite_reunion_id_reunion' })
  comiteReunionIdReunion: number;

  @PrimaryColumn({ name: 'comite_asignacion_recurso_id_asg' })
  comiteAsignacionRecursoIdAsg: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  nombre: string;

  @Column({ name: 'duracion', nullable: true })
  duracion: number;

  @Column({ name: 'tema', length: 45, nullable: true })
  tema: string;

  // Relación Many-to-One con Comunidad
  @ManyToOne(() => Comunidad, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'comunidad_id_comunidad', referencedColumnName: 'idComunidad' })
  comunidad: Comunidad;

  // Relación Many-to-One con Comite (clave compuesta)
  // Las propiedades en JoinColumn deben coincidir con las PrimaryColumn definidas arriba.
  @ManyToOne(() => Comite, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn([
    { name: 'comite_id_comite', referencedColumnName: 'idComite' },
    { name: 'comite_reunion_id_reunion', referencedColumnName: 'reunionIdReunion' },
    { name: 'comite_asignacion_recurso_id_asg', referencedColumnName: 'asignacionRecursoIdAsg' }
  ])
  comite: Comite;
}