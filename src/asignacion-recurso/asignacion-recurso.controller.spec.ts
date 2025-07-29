import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionRecursoController } from './asignacion-recurso.controller';

describe('AsignacionRecursoController', () => {
  let controller: AsignacionRecursoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignacionRecursoController],
    }).compile();

    controller = module.get<AsignacionRecursoController>(AsignacionRecursoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
