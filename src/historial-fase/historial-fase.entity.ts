import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Proyecto } from '../proyecto/proyecto.entity';

@Entity('historial_fase')
export class HistorialFase {
  @PrimaryGeneratedColumn('increment')
  idHistorial: number;

  @Column({ name: 'fase_numero', type: 'int' })
  faseNumero: number | null;

  @Column({ name: 'justificacion', type: 'text' })
  justificacion: string;

  @Column({ name: 'documento_url', type: 'varchar', length: 255, nullable: true })
  documentoUrl: string | null;

  @Column({ name: 'fecha_registro', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaRegistro: Date;

  // Relación Muchos a Uno: Un historial pertenece a un solo proyecto
  @ManyToOne(() => Proyecto, proyecto => proyecto.historialFases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id_proyecto' })
  proyecto: Proyecto;

  @Column({ name: 'proyecto_id_proyecto', type: 'int' })
  proyectoIdProyecto: number;
}