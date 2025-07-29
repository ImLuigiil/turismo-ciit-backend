import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRolDto {
  @IsNumber()
  @IsNotEmpty()
  idRol: number;

  @IsString()
  @IsOptional()
  nombre?: string;
}