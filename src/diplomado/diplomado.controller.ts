// src/diplomado/diplomado.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { DiplomadoService } from './diplomado.service';
import { CreateDiplomadoDto } from './dto/create-diplomado.dto';
import { UpdateDiplomadoDto } from './dto/update-diplomado.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('diplomados')
export class DiplomadoController {
  constructor(private readonly diplomadoService: DiplomadoService) {}

  @Get()
  findAll() {
    return this.diplomadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diplomadoService.findOne(+id);
  }

  // --- Endpoint para AGREGAR/SUBIR DIPLOMADO ---
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', { // 'file' es el nombre del campo en el formulario que contendrá el archivo
      storage: diskStorage({
        destination: './uploads/diplomados', // Carpeta donde se guardarán los PDFs. Asegúrate de que exista.
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => { // Filtro para solo permitir PDFs
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos PDF!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5 // Límite de 5MB por archivo (ajusta según necesites)
      }
    })
  )
  async create(
    @UploadedFile() file: Express.Multer.File, // El archivo subido
    @Body() createDiplomadoDto: CreateDiplomadoDto, // Los otros campos del formulario (llegarán como strings)
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo PDF para el diplomado.');
    }
    // --- VERIFICACIÓN CLAVE: La URL se guarda como path relativo ---
    createDiplomadoDto.link = `/uploads/diplomados/${file.filename}`;
    // --- FIN VERIFICACIÓN ---
    
    // Convertir a Number/Date si vienen como string de FormDat
    
    return this.diplomadoService.create(createDiplomadoDto);
  }

  // --- Endpoint para ACTUALIZAR DIPLOMADO ---
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/diplomados',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos PDF!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5
      }
    })
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDiplomadoDto: UpdateDiplomadoDto,
  ) {
    if (file) {
      updateDiplomadoDto.link = `/uploads/diplomados/${file.filename}`;
    }

    if (updateDiplomadoDto.fechaSubida) {
        updateDiplomadoDto.fechaSubida = new Date(updateDiplomadoDto.fechaSubida);
    }
    
    return this.diplomadoService.update(+id, updateDiplomadoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.diplomadoService.remove(+id);
  }
}
