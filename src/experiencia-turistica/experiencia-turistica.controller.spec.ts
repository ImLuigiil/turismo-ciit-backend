import { Test, TestingModule } from '@nestjs/testing';
import { ExperienciaTuristicaController } from './experiencia-turistica.controller';

describe('ExperienciaTuristicaController', () => {
  let controller: ExperienciaTuristicaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienciaTuristicaController],
    }).compile();

    controller = module.get<ExperienciaTuristicaController>(ExperienciaTuristicaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
