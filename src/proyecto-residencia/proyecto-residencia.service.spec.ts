import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoResidenciaService } from './proyecto-residencia.service';

describe('ProyectoResidenciaService', () => {
  let service: ProyectoResidenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProyectoResidenciaService],
    }).compile();

    service = module.get<ProyectoResidenciaService>(ProyectoResidenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
