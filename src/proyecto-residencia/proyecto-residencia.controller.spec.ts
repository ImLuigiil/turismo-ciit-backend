import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoResidenciaController } from './proyecto-residencia.controller';

describe('ProyectoResidenciaController', () => {
  let controller: ProyectoResidenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProyectoResidenciaController],
    }).compile();

    controller = module.get<ProyectoResidenciaController>(ProyectoResidenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
