import { Test, TestingModule } from '@nestjs/testing';
import { PromocionController } from './promocion.controller';

describe('PromocionController', () => {
  let controller: PromocionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromocionController],
    }).compile();

    controller = module.get<PromocionController>(PromocionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
