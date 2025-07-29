import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('proyectoResidencia')
export class ProyectoResidencia {
  @PrimaryColumn({ name: 'id_residencia' })
  idResidencia: number;

  @Column({ name: 'nombre', length: 45, nullable: true })
  @Index({ unique: true }) 
  nombre: string;

  @Column({ name: 'descripcion', length: 45, nullable: true })
  descripcion: string;

  @Column({ name: 'nombreAlumno', length: 45, nullable: true })
  nombreAlumno: string;

  @Column({ name: 'ciclo', length: 45, nullable: true })
  ciclo: string;
}