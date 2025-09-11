// src/proyecto/proyecto.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards, UploadedFiles, UseInterceptors, BadRequestException, Res, Patch, UploadedFile, NotFoundException } from '@nestjs/common'; // Importa Patch y UploadedFile
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express'; // Importa FileInterceptor
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProyectoImagen } from '../proyecto-imagen/proyecto-imagen.entity';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import * as fs from 'fs';
import axios from 'axios';
import { Proyecto } from './proyecto.entity';


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

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/concluir-fase') // Define el método PATCH y la ruta específica
  @UseInterceptors(
    FileInterceptor('documento', { // 'documento' es el nombre del campo para el archivo PDF
      storage: diskStorage({
        destination: './uploads/documentos_justificacion', // Carpeta para documentos de justificación
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => { // Solo permitir PDFs
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos PDF como documento de justificación!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10 // Límite de 10MB para el documento
      }
    })
  )
  async concluirFase(
    @Param('id') id: string,
    @UploadedFile() documento: Express.Multer.File, // El archivo PDF subido
    @Body('justificacion') justificacion: string, // El texto de justificación del body
  ) {
    if (!justificacion || justificacion.trim() === '') {
      throw new BadRequestException('La justificación es obligatoria para avanzar de fase.');
    }
    if (!documento) {
      throw new BadRequestException('Se requiere un documento PDF que avale el cambio de fase.');
    }

    const documentoUrl = `/uploads/documentos_justificacion/${documento.filename}`;
    
    // Llama al servicio para avanzar la fase y guardar la justificación/documento
    return this.proyectoService.concluirFase(+id, justificacion, documentoUrl);
  }

  @Get('report/general')
  @UseGuards(AuthGuard('jwt'))
  async generateGeneralReport(@Res() res: Response) {
    const proyectos = await this.proyectoService.findAll();

    const doc = new PDFDocument();
    const filename = `reporte_general_proyectos_${new Date().toISOString().split('T')[0]}.pdf`;

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

      doc.image(tecNMImageBuffer, 50, 50, { width: 100 });
      doc.image(itoImageBuffer, doc.page.width - 150, 50, { width: 100 });
    } catch (error) {
      console.error('Error al descargar los logos:', error.message);
      doc.fontSize(10).text('Error al cargar los logos.', 50, 50);
    }

    doc.moveDown(4);
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text('Reporte General de Avance de Proyectos', { align: 'center' });
    doc.moveDown(2);
    
    const getPhaseTargetPercentage = (faseActual: number) => {
        if (faseActual < 1) return 0;
        if (faseActual >= 7) return 100;
        if (faseActual <= 3) return faseActual * 25;
        const percentagePerSubPhase = 25 / 4;
        return 75 + (faseActual - 3) * percentagePerSubPhase;
    };

    const calculateTimeBasedProgress = (fechaInicio: Date, fechaFinAprox: Date) => {
        if (!fechaInicio || !fechaFinAprox) return 0;
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFinAprox);
        const currentDate = new Date();
        if (currentDate < startDate) return 0;
        if (currentDate > endDate) return 100;
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedDuration = currentDate.getTime() - startDate.getTime();
        if (totalDuration <= 0) return 100;
        return (elapsedDuration / totalDuration) * 100;
    };

    const calcularAvance = (proyecto: any) => {
        const { fechaInicio, fechaFinAprox, faseActual } = proyecto;
        if (faseActual >= 7) return 100;
        const timeBasedPercentage = fechaInicio && fechaFinAprox ? calculateTimeBasedProgress(fechaInicio, fechaFinAprox) : 0;
        const phaseTargetPercentage = getPhaseTargetPercentage(faseActual ?? 0);
        let finalPercentage;
        const endDate = new Date(fechaFinAprox);
        const currentDate = new Date();
        if (fechaFinAprox && currentDate > endDate && faseActual < 7) {
            finalPercentage = phaseTargetPercentage;
        } else {
            finalPercentage = Math.min(timeBasedPercentage, phaseTargetPercentage);
        }
        return Math.min(100, Math.max(0, Math.round(finalPercentage)));
    };

    const getProgressColor = (proyecto: any) => {
        const { fechaInicio, fechaFinAprox, faseActual } = proyecto;
        if (faseActual >= 7) return '#28a745';
        if (!fechaInicio || !fechaFinAprox) return '#6c757d';
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFinAprox);
        const currentDate = new Date();
        if (currentDate > endDate) return '#dc3545';
        const timeBasedPercentage = calculateTimeBasedProgress(fechaInicio, fechaFinAprox);
        const phaseTargetPercentage = getPhaseTargetPercentage(faseActual ?? 0);
        const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        const percentageDifference = phaseTargetPercentage - timeBasedPercentage;
        const daysBehind = (percentageDifference / 100) * totalDays;
        const YELLOW_DAYS_THRESHOLD = 4;
        const RED_DAYS_THRESHOLD = 5;
        if (daysBehind >= RED_DAYS_THRESHOLD) return '#dc3545';
        if (daysBehind > 0 && daysBehind <= YELLOW_DAYS_THRESHOLD) return '#ffc107';
        return '#28a745';
    };

    if (proyectos.length === 0) {
      doc.fontSize(12).fillColor('#000000').text('No hay proyectos registrados en el sistema.', { align: 'center' });
    } else {
      proyectos.forEach((proyecto, index) => {
        const avance = calcularAvance(proyecto);
        const color = getProgressColor(proyecto);
        

        const yPos = doc.y;

        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text(`${index + 1}. ${proyecto.nombre}`);
                

        const progressBarWidth = 200;
        const progressBarHeight = 10;
        const progressX = doc.page.width - 250;
        const progressY = yPos + 18;

                
        doc.rect(progressX, progressY, progressBarWidth, progressBarHeight)
           .stroke('#e0e0e0');

        doc.rect(progressX, progressY, (avance / 100) * progressBarWidth, progressBarHeight)
           .fill(color);
        
        doc.font('Helvetica-Bold').text('Avance: ', { continued: true })
           .font('Helvetica').text(`Fase ${proyecto.faseActual} (${avance}%)`);
        doc.moveDown(0.2);
        
        doc.fontSize(10).fillColor('#000000');
        doc.font('Helvetica-Bold').text('Comunidad: ', { continued: true })
           .font('Helvetica').text(`${proyecto.comunidad ? proyecto.comunidad.nombre : 'N/A'}`);
        doc.moveDown(0.2);
           
        doc.font('Helvetica-Bold').text('Población Beneficiada: ', { continued: true })
           .font('Helvetica').text(`${proyecto.poblacionBeneficiada ? proyecto.poblacionBeneficiada.toLocaleString('en-US') : 'N/A'}`);
        doc.moveDown(0.2);
        
        
        doc.moveDown(1.5);
      });
    }

    doc.end();
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

      doc.image(tecNMImageBuffer, 50, 50, { width: 100 });
      doc.image(itoImageBuffer, doc.page.width - 150, 50, { width: 100 });
    } catch (error) {
      console.error('Error al descargar los logos:', error.message);
      doc.fontSize(10).text('Error al cargar los logos.', 50, 50);
    }

    doc.moveDown(4);
    doc.fontSize(14).font('Helvetica-Bold').text(`Reporte del Proyecto: ${project.nombre}`, { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('Información General:');
    doc.moveDown(1);

    doc.fontSize(12);

    doc.font('Helvetica-Bold').text('ID del Proyecto: ', { continued: true })
       .font('Helvetica').text(`${project.idProyecto}`);
    doc.moveDown(1);

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

    if (project.justificacionFase) {
      doc.fontSize(14).font('Helvetica-Bold').text('Justificación de Último Cambio de Fase:');
      doc.moveDown(1);
      doc.fontSize(12).font('Helvetica').text(project.justificacionFase);
      doc.moveDown(2);
    }

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
        doc.moveDown(1);
      });
    } else {
      doc.fontSize(12).font('Helvetica').text('No hay personas involucradas registradas.');
      doc.moveDown(1);
    }

    if (project.imagenes && project.imagenes.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Imágenes del Proyecto:');
      doc.moveDown(1);

      const imagePathBase = join(__dirname, '..', 'uploads');

      project.imagenes.forEach((img, index) => {
        const fullImagePath = join(imagePathBase, img.url);

        if (fs.existsSync(fullImagePath)) {
          doc.image(fullImagePath, {
            fit: [500, 300],
            align: 'center',
            valign: 'center'
          });
          doc.moveDown(1);
        } else {
          doc.fontSize(12).font('Helvetica').text(`Imagen ${index + 1}: Archivo no encontrado en el servidor.`);
          doc.moveDown(1);
        }
      });
    } else {
      doc.fontSize(14).font('Helvetica-Bold').text('Imágenes del Proyecto:');
      doc.moveDown(1);
      doc.fontSize(12).font('Helvetica').text('No hay imágenes asociadas a este proyecto.');
      doc.moveDown(1);
    }
    doc.end();
  }
}