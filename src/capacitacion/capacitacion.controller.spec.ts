import { Test, TestingModule } from '@nestjs/testing';
import { CapacitacionController } from './capacitacion.controller';

describe('CapacitacionController', () => {
  let controller: CapacitacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapacitacionController],
    }).compile();

    controller = module.get<CapacitacionController>(CapacitacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
