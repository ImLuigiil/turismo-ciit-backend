import { PartialType } from '@nestjs/mapped-types';
import { CreateDiplomadoDto } from './create-diplomado.dto';

export class UpdateDiplomadoDto extends PartialType(CreateDiplomadoDto) {}