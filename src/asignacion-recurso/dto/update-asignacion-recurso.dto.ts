import { PartialType } from '@nestjs/mapped-types';
import { CreateAsignacionRecursoDto } from './create-asignacion-recurso.dto';

export class UpdateAsignacionRecursoDto extends PartialType(CreateAsignacionRecursoDto) {}