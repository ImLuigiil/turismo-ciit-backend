import { IsNumber, IsString, IsOptional, IsNotEmpty, IsDateString, IsBoolean } from 'class-validator';

export class CreateReunionDto {
  @IsNumber()
  @IsNotEmpty()
  idReunion: number;

  @IsDateString()
  @IsOptional() // Según tu SQL, es NULL, pero es UNIQUE.
  fecha?: Date;

  @IsNumber()
  @IsOptional()
  hora?: number;

  @IsString()
  @IsOptional()
  lugar?: string;

  @IsString()
  @IsOptional()
  tema?: string;

  @IsNumber() // Usa IsNumber para TINYINT si representa un número entero
  @IsOptional()
  // O si es 0/1 y quieres que sea boolean: @IsBoolean() @Transform(({ value }) => !!parseInt(value))
  status?: number;
}