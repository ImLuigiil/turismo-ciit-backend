// src/curso/dto/create-curso.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCursoDto {

  @IsString()
  @IsNotEmpty({ message: 'El nombre del curso es obligatorio.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El tipo de curso (video/pdf) es obligatorio.' })
  @IsIn(['video', 'pdf'], { message: 'El tipo de curso debe ser "video" o "pdf".' })
  tipo: string;

  @IsString()
  @IsOptional()
  link?: string | null;
}
