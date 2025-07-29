import { Test, TestingModule } from '@nestjs/testing';
import { PersonaProyectoController } from './persona-proyecto.controller';

describe('PersonaProyectoController', () => {
  let controller: PersonaProyectoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonaProyectoController],
    }).compile();

    controller = module.get<PersonaProyectoController>(PersonaProyectoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
