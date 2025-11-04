import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Proyecto } from '../proyecto/proyecto.entity'; 

@Entity('proyecto_imagen')
export class ProyectoImagen {
  @PrimaryGeneratedColumn({ name: 'id_proyecto_imagen' })
  idProyectoImagen: number;

  @Column({ name: 'url', length: 255, nullable: false, type: 'varchar' })
  url: string;

  @Column({ name: 'es_principal', type: 'tinyint', default: 0, nullable: true }) 
  esPrincipal: number | null;

  @Column({ name: 'orden', type: 'int', default: 0, nullable: true })
  orden: number | null;

  @Column({ name: 'proyecto_id_proyecto' }) 
  proyectoIdProyecto: number;

  @ManyToOne(() => Proyecto, proyecto => proyecto.imagenes, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'proyecto_id_proyecto', referencedColumnName: 'idProyecto' })
  proyecto: Proyecto;
}

