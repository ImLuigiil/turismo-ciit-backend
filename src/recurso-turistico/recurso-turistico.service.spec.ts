import { Test, TestingModule } from '@nestjs/testing';
import { RecursoTuristicoService } from './recurso-turistico.service';

describe('RecursoTuristicoService', () => {
  let service: RecursoTuristicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecursoTuristicoService],
    }).compile();

    service = module.get<RecursoTuristicoService>(RecursoTuristicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
