// src/curso/curso.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('cursos')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Get()
  findAll() {
    return this.cursoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursoService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', { 
      storage: diskStorage({
        destination: './uploads/cursos',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos PDF para cursos de tipo "pdf"!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10
      }
    })
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any, 
  ) {
    const createCursoDto: CreateCursoDto = {
      nombre: body.nombre,
      tipo: body.tipo,
      link: body.link || null,
    };

    if (createCursoDto.tipo === 'pdf') {
      if (!file) {
        throw new BadRequestException('Se requiere un archivo PDF para cursos de tipo "pdf".');
      }
      createCursoDto.link = `/uploads/cursos/${file.filename}`;
    } else if (createCursoDto.tipo === 'video') {
      if (!createCursoDto.link || !createCursoDto.link.startsWith('http')) {
        throw new BadRequestException('Se requiere un enlace URL válido para cursos de tipo "video".');
      }
      if (file) {
        throw new BadRequestException('No se debe subir un archivo para cursos de tipo "video".');
      }
    } else {
      throw new BadRequestException('Tipo de curso no válido. Debe ser "video" o "pdf".');
    }

    return this.cursoService.create(createCursoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/cursos',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos PDF para cursos de tipo "pdf"!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10
      }
    })
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const updateCursoDto: UpdateCursoDto = {
      nombre: body.nombre,
      tipo: body.tipo,
      link: body.link || null,
    };

    if (updateCursoDto.tipo === 'pdf') {
      if (file) {
        updateCursoDto.link = `/uploads/cursos/${file.filename}`;
      } else if (!updateCursoDto.link || updateCursoDto.link.startsWith('http')) {
        throw new BadRequestException('Se requiere un archivo PDF para actualizar un curso de tipo "pdf" si no se proporciona un enlace existente.');
      }
    } else if (updateCursoDto.tipo === 'video') {
      if (!updateCursoDto.link || !updateCursoDto.link.startsWith('http')) {
        throw new BadRequestException('Se requiere un enlace URL válido para actualizar un curso de tipo "video".');
      }
      if (file) {
        throw new BadRequestException('No se debe subir un archivo para actualizar un curso de tipo "video".');
      }
    } else {
      throw new BadRequestException('Tipo de curso no válido. Debe ser "video" o "pdf".');
    }

    return this.cursoService.update(+id, updateCursoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.cursoService.remove(+id);
  }
}
