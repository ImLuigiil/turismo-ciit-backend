// src/persona-proyecto/persona-proyecto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Proyecto } from '../proyecto/proyecto.entity';

@Entity('persona_proyecto')
export class PersonaProyecto {
  @PrimaryGeneratedColumn({ name: 'id_persona_proyecto' })
  idPersonaProyecto: number;

  @Column({ name: 'apellido_paterno', length: 50, nullable: false, type: 'varchar' }) // Asegúrate de que este también tenga type
  apellidoPaterno: string;

  // --- CORRECCIÓN CLAVE AQUÍ: Añadir 'type: "varchar"' ---
  @Column({ name: 'apellido_materno', length: 50, nullable: true, type: 'varchar' }) // ¡Añadido type: 'varchar'!
  apellidoMaterno: string | null;
  // --- FIN CORRECCIÓN ---

  @Column({ name: 'nombre', length: 50, nullable: false, type: 'varchar' }) // Asegúrate de que este también tenga type
  nombre: string;

  // --- REVISIÓN ADICIONAL: Asegúrate de que estos también tengan 'type' si son nullable ---
  @Column({ name: 'rol_en_proyecto', length: 45, nullable: true, type: 'varchar' }) // ¡Añadido type: 'varchar'!
  rolEnProyecto: string | null;

  @Column({ name: 'contacto', length: 100, nullable: true, type: 'varchar' }) // ¡Añadido type: 'varchar'!
  contacto: string | null;
  // --- FIN REVISIÓN ADICIONAL ---

  @Column({ name: 'proyecto_id_proyecto' })
  proyectoIdProyecto: number;

  @ManyToOne(() => Proyecto, proyecto => proyecto.personasDirectorio, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'proyecto_id_proyecto', referencedColumnName: 'idProyecto' })
  proyecto: Proyecto;
}
