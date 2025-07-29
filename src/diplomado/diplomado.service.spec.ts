import { Test, TestingModule } from '@nestjs/testing';
import { DiplomadoService } from './diplomado.service';

describe('DiplomadoService', () => {
  let service: DiplomadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiplomadoService],
    }).compile();

    service = module.get<DiplomadoService>(DiplomadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
