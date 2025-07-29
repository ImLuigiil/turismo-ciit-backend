import { Test, TestingModule } from '@nestjs/testing';
import { ComiteController } from './comite.controller';

describe('ComiteController', () => {
  let controller: ComiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComiteController],
    }).compile();

    controller = module.get<ComiteController>(ComiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
