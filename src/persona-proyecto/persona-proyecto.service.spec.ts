import { Test, TestingModule } from '@nestjs/testing';
import { PersonaProyectoService } from './persona-proyecto.service';

describe('PersonaProyectoService', () => {
  let service: PersonaProyectoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonaProyectoService],
    }).compile();

    service = module.get<PersonaProyectoService>(PersonaProyectoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
