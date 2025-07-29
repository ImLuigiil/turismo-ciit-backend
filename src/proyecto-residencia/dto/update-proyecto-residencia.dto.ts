import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectoResidenciaDto } from './create-proyecto-residencia.dto';

export class UpdateProyectoResidenciaDto extends PartialType(CreateProyectoResidenciaDto) {}