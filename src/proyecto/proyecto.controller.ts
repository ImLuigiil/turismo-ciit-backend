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
import axios from 'axios';

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

    const tecNMUrl = 'https://www.cdcuauhtemoc.tecnm.mx/wp-content/uploads/2021/08/Logo-TecNM.png';
    const itoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Instituto_Tecnologico_de_Oaxaca_-_original.svg/800px-Instituto_Tecnologico_de_Oaxaca_-_original.svg.png';

    try {
      const [tecNMResponse, itoResponse] = await Promise.all([
        axios.get(tecNMUrl, { responseType: 'arraybuffer' }),
        axios.get(itoUrl, { responseType: 'arraybuffer' })
      ]);
      const tecNMImageBuffer = Buffer.from(tecNMResponse.data);
      const itoImageBuffer = Buffer.from(itoResponse.data);

      doc.image(tecNMImageBuffer, 75, 75, { width: 150 });
      doc.image(itoImageBuffer, doc.page.width - 150, 50, { width: 100 });
    } catch (error) {
      console.error('Error al descargar los logos:', error.message);
      doc.fontSize(10).text('Error al cargar los logos.', 50, 50);
    }
    doc.moveDown(5);

    doc.fontSize(14).font('Helvetica-Bold').text(`Reporte del Proyecto: ${project.nombre}`, { align: 'center' });
    doc.moveDown(1);

    // Información General
    doc.fontSize(14).font('Helvetica-Bold').text('Información General:');
    doc.moveDown(1);

    doc.fontSize(12).font('Helvetica-Bold').text('ID del Proyecto: ', { continued: true })
       .font('Helvetica').text(`${project.idProyecto}`);
    doc.moveDown(1); // Espacio de 1 mínimo

    doc.font('Helvetica-Bold').text('Descripción: ', { continued: true })
       .font('Helvetica').text(`${project.descripcion || 'N/A'}`);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Comunidad: ', { continued: true })
       .font('Helvetica').text(`${project.comunidad ? project.comunidad.nombre : 'N/A'}`);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Población Beneficiada: ', { continued: true })
       .font('Helvetica').text(`${project.poblacionBeneficiada ? project.poblacionBeneficiada.toLocaleString('en-US') : 'N/A'}`);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Número de Capítulos: ', { continued: true })
       .font('Helvetica').text(`${project.noCapitulos || 'N/A'}`);
    doc.moveDown(1);

    // Función de formato de fecha DD/MM/YYYY
    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    doc.font('Helvetica-Bold').text('Fecha de Inicio: ', { continued: true })
       .font('Helvetica').text(`${formatDate(project.fechaInicio)}`);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Fecha Fin Aprox: ', { continued: true })
       .font('Helvetica').text(`${formatDate(project.fechaFinAprox)}`);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Fase Actual: ', { continued: true })
       .font('Helvetica').text(`${project.faseActual || 'N/A'}`);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Cambios de Nombre: ', { continued: true })
       .font('Helvetica').text(`${project.nombreCambiosCount || 0}`);
    doc.moveDown(2);

    // Justificación de Fase (solo si existe)
    if (project.justificacionFase) {
      doc.fontSize(14).font('Helvetica-Bold').text('Justificación de Último Cambio de Fase:');
      doc.moveDown(1);
      doc.fontSize(12).font('Helvetica').text(project.justificacionFase);
      doc.moveDown(2);
    }

    // Personas Involucradas
    doc.fontSize(14).font('Helvetica-Bold').text('Personas Involucradas:');
    doc.moveDown(1);
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
        doc.moveDown(1); // Espacio entre personas
      });
    } else {
      doc.fontSize(12).font('Helvetica').text('No hay personas involucradas registradas.');
      doc.moveDown(1);
    }

    doc.end();
  }
}
