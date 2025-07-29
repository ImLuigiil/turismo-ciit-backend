import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoImagenService } from './proyecto-imagen.service';

describe('ProyectoImagenService', () => {
  let service: ProyectoImagenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProyectoImagenService],
    }).compile();

    service = module.get<ProyectoImagenService>(ProyectoImagenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
