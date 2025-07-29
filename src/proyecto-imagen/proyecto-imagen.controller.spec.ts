import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoImagenController } from './proyecto-imagen.controller';

describe('ProyectoImagenController', () => {
  let controller: ProyectoImagenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProyectoImagenController],
    }).compile();

    controller = module.get<ProyectoImagenController>(ProyectoImagenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
