
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { PersonaProyecto } from '../persona-proyecto/persona-proyecto.entity';
import { Comunidad } from '../comunidad/comunidad.entity';
import { ProyectoImagen } from '../proyecto-imagen/proyecto-imagen.entity';

@Entity('proyecto')
export class Proyecto {
  @PrimaryGeneratedColumn({ name: 'id_proyecto' })
  idProyecto: number;

  @Column({ name: 'nombre', length: 45, unique: true })
  nombre: string;

  @Column({ name: 'descripcion', length: 512, nullable: true, type: 'varchar' })
  descripcion: string | null;

  @Column({ name: 'no_capitulos', nullable: true, type: 'int' })
  noCapitulos: number | null;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fechaInicio: Date | null;

  @Column({ name: 'fecha_fin_aprox', type: 'date', nullable: true })
  fechaFinAprox: Date | null;

  @Column({ name: 'fase_actual', nullable: true, type: 'int' })
  faseActual: number | null;

  @Column({ name: 'comunidad_id_comunidad', nullable: true, type: 'int' })
  comunidadIdComunidad: number | null;

  @Column({ name: 'nombre_cambios_count', type: 'int', default: 0 })
  nombreCambiosCount: number;

  @Column({ name: 'poblacion_beneficiada', type: 'int', nullable: true })
  poblacionBeneficiada: number | null;

  @Column({ name: 'justificacion_fase', type: 'text', nullable: true })
  justificacionFase: string | null;


  @OneToMany(() => ProyectoImagen, imagen => imagen.proyecto, { cascade: true })
  imagenes: ProyectoImagen[];

  @ManyToOne(() => Comunidad, comunidad => comunidad.proyectos)
  @JoinColumn({ name: 'comunidad_id_comunidad', referencedColumnName: 'idComunidad' })
  comunidad: Comunidad | null;

  @OneToMany(() => PersonaProyecto, persona => persona.proyecto, { cascade: true })
  personasDirectorio: PersonaProyecto[];
}
