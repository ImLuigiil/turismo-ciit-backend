import { Test, TestingModule } from '@nestjs/testing';
import { ExperienciaTuristicaService } from './experiencia-turistica.service';

describe('ExperienciaTuristicaService', () => {
  let service: ExperienciaTuristicaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperienciaTuristicaService],
    }).compile();

    service = module.get<ExperienciaTuristicaService>(ExperienciaTuristicaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
