// src/proyecto/proyecto.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards, UploadedFiles, UseInterceptors,NotFoundException, BadRequestException, Res } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProyectoImagen } from '../proyecto-imagen/proyecto-imagen.entity';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express'; 

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Get()
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectoService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('images', 15, { 
      storage: diskStorage({
        destination: './uploads/proyectos',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => { 
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos de imagen (jpg, jpeg, png, gif)!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5
      }
    })
  )
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any, 
  ) {
    const createProyectoDto: CreateProyectoDto = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      comunidadIdComunidad: body.comunidadIdComunidad ? Number(body.comunidadIdComunidad) : null,
      noCapitulos: body.noCapitulos ? Number(body.noCapitulos) : null,
      fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : null,
      fechaFinAprox: body.fechaFinAprox ? new Date(body.fechaFinAprox) : null,
      faseActual: body.faseActual ? Number(body.faseActual) : null,
      poblacionBeneficiada: body.poblacionBeneficiada ? Number(body.poblacionBeneficiada) : null,
      justificacionFase: body.justificacionFase || null,
    };

    if (!files || files.length === 0) {
      throw new BadRequestException('Se requiere al menos una imagen para el proyecto.');
    }

    const imagenes = files.map(fileItem => ({
      url: `/uploads/proyectos/${fileItem.filename}`,
      esPrincipal: 0,
      orden: 0,
    }));

    return this.proyectoService.createProjectWithImages(createProyectoDto, imagenes);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 15, {
      storage: diskStorage({
        destination: './uploads/proyectos',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos de imagen (jpg, jpeg, png, gif)!'), false);
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
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    const updateProyectoDto: UpdateProyectoDto = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      comunidadIdComunidad: body.comunidadIdComunidad ? Number(body.comunidadIdComunidad) : null,
      noCapitulos: body.noCapitulos ? Number(body.noCapitulos) : null,
      fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : null,
      fechaFinAprox: body.fechaFinAprox ? new Date(body.fechaFinAprox) : null,
      faseActual: body.faseActual ? Number(body.faseActual) : null,
      poblacionBeneficiada: body.poblacionBeneficiada ? Number(body.poblacionBeneficiada) : null,
      justificacionFase: body.justificacionFase || null,
    };

    const imagesToDeleteIds: number[] = body.imagesToDeleteIds ? JSON.parse(body.imagesToDeleteIds) : [];
    const imagesToUpdateData: Partial<ProyectoImagen>[] = body.imagesToUpdateData ? JSON.parse(body.imagesToUpdateData) : [];

    const newImages = files.map(fileItem => ({
      url: `/uploads/proyectos/${fileItem.filename}`,
      esPrincipal: 0,
      orden: 0,
    }));

    return this.proyectoService.updateProjectWithImages(+id, updateProyectoDto, newImages, imagesToDeleteIds, imagesToUpdateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.proyectoService.remove(+id);
  }

  @Get(':id/report')
  @UseGuards(AuthGuard('jwt')) 
  async generateReport(
    @Param('id') id: string,
    @Res() res: Response 
  ) {
    const project = await this.proyectoService.getProjectReportData(+id);

    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado para generar reporte.`);
    }

    const doc = new PDFDocument();
    const filename = `reporte_proyecto_${project.idProyecto}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res); 

    doc.fontSize(20).text(`${project.nombre}`, { align: 'center' });
    doc.moveDown(2); 

    doc.fontSize(14).text('Información General:', { underline: true });
    doc.moveDown(1); 

    doc.fontSize(12); 

    doc.font('Helvetica-Bold').text('ID del Proyecto: ', { continued: true })
       .font('Helvetica').text(`${project.idProyecto}`);
    doc.moveDown(0.5); 

    doc.font('Helvetica-Bold').text('Descripción: ', { continued: true })
       .font('Helvetica').text(`${project.descripcion || 'N/A'}`);
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Comunidad: ', { continued: true })
       .font('Helvetica').text(`${project.comunidad ? project.comunidad.nombre : 'N/A'}`);
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Población Beneficiada: ', { continued: true })
       .font('Helvetica').text(`${project.poblacionBeneficiada || 'N/A'}`);
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Número de Capítulos: ', { continued: true })
       .font('Helvetica').text(`${project.noCapitulos || 'N/A'}`);
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Fecha de Inicio: ', { continued: true })
       .font('Helvetica').text(`${project.fechaInicio ? new Date(project.fechaInicio).toLocaleDateString() : 'N/A'}`);
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Fecha Fin Aprox: ', { continued: true })
       .font('Helvetica').text(`${project.fechaFinAprox ? new Date(project.fechaFinAprox).toLocaleDateString() : 'N/A'}`);
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Fase Actual: ', { continued: true })
       .font('Helvetica').text(`${project.faseActual || 'N/A'}`);
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Cambios de Nombre: ', { continued: true })
       .font('Helvetica').text(`${project.nombreCambiosCount || 0}`);
    doc.moveDown(1);

    if (project.justificacionFase) {
      doc.fontSize(14).text('Justificación de Último Cambio de Fase:', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(project.justificacionFase);
      doc.moveDown(1);
    }

    doc.fontSize(14).text('Personas Involucradas:', { underline: true });
    doc.moveDown(0.5);
    if (project.personasDirectorio && project.personasDirectorio.length > 0) {
      project.personasDirectorio.forEach(persona => {
        doc.fontSize(12); 
        doc.font('Helvetica-Bold').text('Nombre: ', { continued: true })
           .font('Helvetica').text(`${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno || ''}`);
        doc.moveDown(0.2);

        if (persona.rolEnProyecto) {
          doc.font('Helvetica-Bold').text('Rol: ', { continued: true })
             .font('Helvetica').text(`${persona.rolEnProyecto}`);
          doc.moveDown(0.2);
        }
        if (persona.contacto) {
          doc.font('Helvetica-Bold').text('Contacto: ', { continued: true })
             .font('Helvetica').text(`${persona.contacto}`);
          doc.moveDown(0.2);
        }
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(12).text('No hay personas involucradas registradas.');
    }
    doc.moveDown();

    doc.fontSize(14).text('Imágenes del Proyecto:', { underline: true });
    doc.moveDown(0.5);
    if (project.imagenes && project.imagenes.length > 0) {
        project.imagenes.forEach((img, index) => {
            doc.fontSize(10).text(`Imagen ${index + 1}: ${res.req.protocol}://${res.req.get('host')}${img.url}`);
        });
    } else {
        doc.fontSize(12).text('No hay imágenes asociadas a este proyecto.');
    }
    doc.moveDown();

    doc.end();
  }
}
