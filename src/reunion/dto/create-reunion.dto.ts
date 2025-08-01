import { IsNumber, IsString, IsOptional, IsNotEmpty, IsDateString, IsBoolean } from 'class-validator';

export class CreateReunionDto {
  @IsNumber()
  @IsNotEmpty()
  idReunion: number;

  @IsDateString()
  @IsOptional() 
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

  @IsNumber()
  @IsOptional()
  status?: number;
}