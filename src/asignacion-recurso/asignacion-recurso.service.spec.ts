import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionRecursoService } from './asignacion-recurso.service';

describe('AsignacionRecursoService', () => {
  let service: AsignacionRecursoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsignacionRecursoService],
    }).compile();

    service = module.get<AsignacionRecursoService>(AsignacionRecursoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
