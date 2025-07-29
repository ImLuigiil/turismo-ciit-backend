import { Test, TestingModule } from '@nestjs/testing';
import { PromocionService } from './promocion.service';

describe('PromocionService', () => {
  let service: PromocionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromocionService],
    }).compile();

    service = module.get<PromocionService>(PromocionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
