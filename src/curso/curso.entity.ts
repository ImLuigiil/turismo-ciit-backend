// src/curso/curso.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'; // Asegúrate de importar PrimaryGeneratedColumn

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn({ name: 'id_curso' }) // ¡DEBE SER PrimaryGeneratedColumn!
  idCurso: number;

  @Column({ name: 'nombre', length: 45, nullable: true, type: 'varchar' })
  nombre: string | null;

  @Column({ name: 'tipo', length: 45, nullable: false, type: 'varchar' }) // 'video' o 'pdf'
  tipo: string;

  @Column({ name: 'link', length: 255, nullable: true, type: 'varchar' }) // URL de video o ruta de archivo PDF
  link: string | null;
}
