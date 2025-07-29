import { PartialType } from '@nestjs/mapped-types';
import { CreateComiteDto } from './create-comite.dto';

// Para la actualización, los IDs de la clave primaria compuesta no deben ser actualizables
// por eso usamos PartialType de CreateComiteDto.
export class UpdateComiteDto extends PartialType(CreateComiteDto) {}