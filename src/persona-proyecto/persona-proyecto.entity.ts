// src/persona-proyecto/persona-proyecto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Proyecto } from '../proyecto/proyecto.entity';

@Entity('persona_proyecto')
export class PersonaProyecto {
  @PrimaryGeneratedColumn({ name: 'id_persona_proyecto' })
  idPersonaProyecto: number;

  @Column({ name: 'apellido_paterno', length: 50, nullable: false, type: 'varchar' }) 
  apellidoPaterno: string;


  @Column({ name: 'apellido_materno', length: 50, nullable: true, type: 'varchar' }) 
  apellidoMaterno: string | null;


  @Column({ name: 'nombre', length: 50, nullable: false, type: 'varchar' })
  nombre: string;


  @Column({ name: 'rol_en_proyecto', length: 45, nullable: true, type: 'varchar' }) 
  rolEnProyecto: string | null;

  @Column({ name: 'contacto', length: 100, nullable: true, type: 'varchar' }) 
  contacto: string | null;

  @Column({ name: 'proyecto_id_proyecto' })
  proyectoIdProyecto: number;

  @ManyToOne(() => Proyecto, proyecto => proyecto.personasDirectorio, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'proyecto_id_proyecto', referencedColumnName: 'idProyecto' })
  proyecto: Proyecto;
}
