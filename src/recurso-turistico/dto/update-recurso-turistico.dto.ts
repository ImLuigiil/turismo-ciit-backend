import { PartialType } from '@nestjs/mapped-types';
import { CreateRecursoTuristicoDto } from './create-recurso-turistico.dto';

export class UpdateRecursoTuristicoDto extends PartialType(CreateRecursoTuristicoDto) {}