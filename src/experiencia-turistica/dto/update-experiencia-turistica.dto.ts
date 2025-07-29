import { PartialType } from '@nestjs/mapped-types';
import { CreateExperienciaTuristicaDto } from './create-experiencia-turistica.dto';

export class UpdateExperienciaTuristicaDto extends PartialType(CreateExperienciaTuristicaDto) {}