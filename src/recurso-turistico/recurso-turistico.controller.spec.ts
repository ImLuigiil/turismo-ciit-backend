import { Test, TestingModule } from '@nestjs/testing';
import { RecursoTuristicoController } from './recurso-turistico.controller';

describe('RecursoTuristicoController', () => {
  let controller: RecursoTuristicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecursoTuristicoController],
    }).compile();

    controller = module.get<RecursoTuristicoController>(RecursoTuristicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
