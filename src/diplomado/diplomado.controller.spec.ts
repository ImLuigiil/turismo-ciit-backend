import { Test, TestingModule } from '@nestjs/testing';
import { DiplomadoController } from './diplomado.controller';

describe('DiplomadoController', () => {
  let controller: DiplomadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiplomadoController],
    }).compile();

    controller = module.get<DiplomadoController>(DiplomadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
