import { Test, TestingModule } from '@nestjs/testing';
import { ReunionController } from './reunion.controller';

describe('ReunionController', () => {
  let controller: ReunionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReunionController],
    }).compile();

    controller = module.get<ReunionController>(ReunionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
