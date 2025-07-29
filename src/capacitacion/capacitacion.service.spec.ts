import { Test, TestingModule } from '@nestjs/testing';
import { CapacitacionService } from './capacitacion.service';

describe('CapacitacionService', () => {
  let service: CapacitacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapacitacionService],
    }).compile();

    service = module.get<CapacitacionService>(CapacitacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
