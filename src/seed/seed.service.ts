// src/seed/seed.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // Asegúrate de importar DataSource
import { Comunidad } from '../comunidad/comunidad.entity';
import axios from 'axios';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Comunidad)
    private comunidadesRepository: Repository<Comunidad>,
    private configService: ConfigService,
    private dataSource: DataSource, // Inyecta el DataSource
  ) {}

  async seedOaxacaMunicipalities() {
    this.logger.log('Iniciando el sembrado de municipios de Oaxaca...');
    const apiKey = this.configService.get<string>('COPOMEX_API_KEY');
    if (!apiKey) {
      this.logger.error('COPOMEX_API_KEY no encontrada en las variables de entorno. Asegúrate de tener un archivo .env en la raíz del proyecto.');
      return;
    }

    const stateName = 'Oaxaca'; // Usar el nombre con mayúscula inicial si así viene en la API

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Desactivar verificaciones de claves foráneas temporalmente para permitir el borrado
      this.logger.log('Desactivando verificaciones de claves foráneas...');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
      
      // --- ¡CORRECCIÓN CLAVE AQUÍ! Limpiar la tabla antes de sembrar ---
      this.logger.log('Limpiando tabla de comunidades antes de sembrar...');
      await this.comunidadesRepository.clear(); // Usar .clear() para vaciar la tabla
      // --- FIN CORRECCIÓN ---
      
      // Reactivar verificaciones de claves foráneas
      this.logger.log('Activando verificaciones de claves foráneas...');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

      // 1. Obtener los estados
      const statesApiUrl = `https://api.copomex.com/query/get_estados?token=${apiKey}`;
      const statesResponse = await axios.get(statesApiUrl);

      const statesArrayFromApi = statesResponse.data?.response?.estado;

      if (!Array.isArray(statesArrayFromApi) || statesArrayFromApi.length === 0) {
        this.logger.error('La respuesta de estados de COPOMEX no contiene un array válido en data.response.estado.');
        this.logger.error('Respuesta completa de estados:', statesResponse.data);
        return;
      }

      const oaxacaFound = statesArrayFromApi.includes(stateName);

      if (!oaxacaFound) {
        this.logger.error(`Estado "${stateName}" no encontrado en la lista de estados de COPOMEX.`);
        return;
      }

      // 2. Obtener los municipios de Oaxaca
      const municipalitiesApiUrl = `https://api.copomex.com/query/get_municipio_por_estado/${stateName}?token=${apiKey}`;
      const municipalitiesResponse = await axios.get(municipalitiesApiUrl);

      const municipalitiesFromApi = municipalitiesResponse.data?.response?.municipios;

      if (!Array.isArray(municipalitiesFromApi) || municipalitiesFromApi.length === 0) {
        this.logger.warn(`No se encontraron municipios para ${stateName} o la respuesta no contiene un array válido.`);
        this.logger.warn('Respuesta completa de municipios:', municipalitiesResponse.data);
        return;
      }

      // 3. Sembrar los municipios
      for (const municipio of municipalitiesFromApi) {
        const municipalityName = municipio;

        if (!municipalityName) {
            this.logger.warn('Municipio sin nombre encontrado en la respuesta de la API. Saltando.');
            continue;
        }

        const existingComunidad = await this.comunidadesRepository.findOne({ where: { nombre: municipalityName } });
        if (existingComunidad) {
            this.logger.log(`Municipio ${municipalityName} ya existe. Saltando.`);
            continue;
        }
        
        const newComunidad = this.comunidadesRepository.create({
          nombre: municipalityName,
          ubicacion: stateName,
          poblacion: null,
        });
        await this.comunidadesRepository.save(newComunidad);
        this.logger.log(`Guardado: ${municipalityName}`);
      }

      this.logger.log('Sembrado de municipios de Oaxaca completado.');
    } catch (error) {
      this.logger.error('Error durante el sembrado de municipios:', error.message, error.stack);
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error('Respuesta de error de COPOMEX:', error.response.data);
      }
    } finally {
      await queryRunner.release(); // ¡MUY IMPORTANTE! Liberar el queryRunner
    }
  }
}
