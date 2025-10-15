import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards, UploadedFiles, UseInterceptors, BadRequestException, Res, Patch, UploadedFile, NotFoundException } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProyectoImagen } from '../proyecto-imagen/proyecto-imagen.entity';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import * as fs from 'fs';
import axios from 'axios';
import { Proyecto } from './proyecto.entity';

// --- CONSTANTES ENCABEZADO ---
const SEP_LOGO_URL = 'https://www.gob.mx/cms/uploads/action_program/main_image/3180/post_logo_educ.jpg';
const TECNM_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Tecnologico_Nacional_de_Mexico.svg/1200px-Tecnologico_Nacional_de_Mexico.svg.png';

const HEADER_Y_POS = 50;
const HEADER_MARGIN_BOTTOM = 100; 
const LOGO_HEIGHT = 45; 
const LOGO_SEP_WIDTH = 70; 
const LOGO_TECNM_WIDTH = 110; 
const LINE_COLOR = '#FFD700'; 
const LINE_THICKNESS = 3;
const LOGO_SPACING = 15; 
// --- FIN CONSTANTES ENCABEZADO ---


// --- NUEVAS CONSTANTES PIE DE PÁGINA ---
// Logos al lado izquierdo del texto
const LOGO_IZQ_1_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_ad1TRzUNczr7qEP260D8gu4szFzh_we59w&s'; 
const LOGO_IZQ_2_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL4am0BuytAGl36oNx6laPZkToh0tzlJveOg&s';

const FOOTER_TEXT = 'Av. Universidad 1200, col. Xoxo, Alcaldía Benito Juárez, C.P. 03330.\nCiudad de México. Tel. (55) 3600-2511, ext. 65055\ne-mail: d_direccion@tecnm.mx www.tecnm.mx';

const FOOTER_Y_POS = 750; // Posición Y donde comienza el pie de página (cerca del final de la hoja A4)
const FOOTER_LINE_COLOR = '#C00000'; // Rojo
const FOOTER_LINE_THICKNESS = 1;
const FOOTER_LOGO_SIZE = 30; // Tamaño pequeño para los logos del pie de página
// --- FIN CONSTANTES PIE DE PÁGINA ---


// --- FUNCIÓN REUTILIZABLE PARA EL ENCABEZADO ---
const addHeader = (doc: PDFKit.PDFDocument, sepBuffer: Buffer, tecNmBuffer: Buffer) => {
    const margin = 50; // Margen izquierdo
    const lineX = margin + LOGO_SEP_WIDTH + LOGO_SPACING;
    const lineYStart = HEADER_Y_POS - 5;
    const lineYEnd = HEADER_Y_POS + LOGO_HEIGHT + 5;

    // 1. Logo SEP (Izquierda - Primer logo)
    doc.image(sepBuffer, margin, HEADER_Y_POS, { fit: [LOGO_SEP_WIDTH, LOGO_HEIGHT] });

    // 2. Línea Separadora Vertical Amarilla
    doc.save()
        .moveTo(lineX, lineYStart)
        .lineTo(lineX, lineYEnd)
        .lineWidth(LINE_THICKNESS)
        .stroke(LINE_COLOR);
    doc.restore();

    const tecNmX = lineX + LOGO_SPACING;

    // 3. Logo TecNM (Derecha de la línea)
    doc.image(tecNmBuffer, tecNmX, HEADER_Y_POS, { fit: [LOGO_TECNM_WIDTH, LOGO_HEIGHT] });

    // 4. Margen de Seguridad: Mover el cursor Y debajo del encabezado
    doc.y = HEADER_MARGIN_BOTTOM;
};
// --- FIN FUNCIÓN REUTILIZABLE ---

// --- FUNCIÓN REUTILIZABLE PARA EL PIE DE PÁGINA ---
const addFooter = (doc: PDFKit.PDFDocument, logoIzq1Buffer: Buffer, logoIzq2Buffer: Buffer) => {
    const margin = 50;
    const pageRightBound = doc.page.width - margin;
    let currentX = margin;
    const logoY = FOOTER_Y_POS;

    // 1. Dibujar logos izquierdos
    doc.image(logoIzq1Buffer, currentX, logoY, { fit: [FOOTER_LOGO_SIZE, FOOTER_LOGO_SIZE] });
    currentX += FOOTER_LOGO_SIZE + 10;

    doc.image(logoIzq2Buffer, currentX, logoY, { fit: [FOOTER_LOGO_SIZE, FOOTER_LOGO_SIZE] });
    currentX += FOOTER_LOGO_SIZE + 30;

    // 2. Dibujar texto de dirección (Alineado a la derecha de los logos o en el centro)
    doc.fontSize(7) // Fuente pequeña para el pie de página
       .fillColor('#444444')
       .font('Helvetica')
       .text(
           FOOTER_TEXT, 
           currentX, 
           logoY + 5, 
           { // Opciones de texto
               width: pageRightBound - currentX,
               align: 'left' as const, 
               lineGap: 2 
           }
       );

    // 3. Dibujar línea roja horizontal
    const lineY = FOOTER_Y_POS + FOOTER_LOGO_SIZE + 10;
    doc.save()
        .moveTo(margin, lineY)
        .lineTo(pageRightBound, lineY)
        .lineWidth(FOOTER_LINE_THICKNESS)
        .stroke(FOOTER_LINE_COLOR);
    doc.restore();

    // 4. Mover cursor Y para asegurar que el siguiente contenido no pegue con el footer
    // LÍNEA CORREGIDA: Ya no modificamos doc.y aquí para evitar la recursión. 
    // addHeader ya reseteó doc.y al margen superior (100).
    // doc.y = lineY + 10; 
};
// --- FIN FUNCIÓN REUTILIZABLE ---


const getPhaseSchedule = (fechaInicio: Date | null, fechaFinAprox: Date | null) => {
  if (!fechaInicio || !fechaFinAprox) {
    return [];
  }
  const startDate = new Date(fechaInicio);
  const endDate = new Date(fechaFinAprox);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate) {
    return [];
  }
  const totalDurationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const timeForFirstThreePhases = totalDurationDays * 0.75;
  const daysPerEarlyPhase = timeForFirstThreePhases / 3;
  const timeForLastFourPhases = totalDurationDays * 0.25;
  const daysPerLatePhase = timeForLastFourPhases / 4;
  const phaseEndDates: Date[] = [];
  let cumulativeDays = 0;
  for (let i = 0; i < 3; i++) {
    cumulativeDays += daysPerEarlyPhase;
    const phaseEndDate = new Date(startDate);
    phaseEndDate.setDate(startDate.getDate() + cumulativeDays);
    phaseEndDates.push(phaseEndDate);
  }
  for (let i = 0; i < 4; i++) {
    cumulativeDays += daysPerLatePhase;
    const phaseEndDate = new Date(startDate);
    phaseEndDate.setDate(startDate.getDate() + Math.round(cumulativeDays));
    phaseEndDates.push(phaseEndDate);
  }
  return phaseEndDates;
};

const calculateTimeBasedProgress = (fechaInicio: Date | null, fechaFinAprox: Date | null) => {
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

const calcularAvance = (fechaInicio: Date | null, fechaFinAprox: Date | null, faseActual: number | null) => {
    if (!fechaInicio || !fechaFinAprox || faseActual === null) return 0;
    if ((faseActual ?? 0) >= 7) {
        return 100;
    }
    const getPhaseProgress = (fase: number) => {
        if (fase <= 1) return 0;
        const progressMap = { 2: 25, 3: 50, 4: 75, 5: 81.25, 6: 87.5, 7: 100 };
        return progressMap[fase] || 0;
    };
    const timeBasedPercentage = calculateTimeBasedProgress(fechaInicio, fechaFinAprox);
    const phaseTargetPercentage = getPhaseProgress(faseActual);
    const endDate = new Date(fechaFinAprox);
    const currentDate = new Date();
    if (currentDate > endDate && faseActual < 7) {
        return Math.min(100, Math.max(0, Math.round(phaseTargetPercentage)));
    }
    let finalPercentage = Math.max(timeBasedPercentage, phaseTargetPercentage);
    return Math.min(100, Math.max(0, Math.round(finalPercentage)));
};

const getProgressColor = (fechaInicio: Date | null, fechaFinAprox: Date | null, faseActual: number | null) => {
  if (!fechaInicio || !fechaFinAprox || faseActual === null || faseActual < 1) {
    return '#28a745';
  }
  if (faseActual === 7) {
    return '#28a745';
  }
  const currentDate = new Date();
  const endDate = new Date(fechaFinAprox);
  if (currentDate > endDate) {
    return '#dc3545';
  }
  const schedule = getPhaseSchedule(fechaInicio, fechaFinAprox);
  if (schedule.length === 0) {
    return '#28a745';
  }
  const expectedEndDateForCurrentPhase = schedule[faseActual - 1];
  const timeDifference = currentDate.getTime() - expectedEndDateForCurrentPhase.getTime();
  const daysBehind = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  if (daysBehind <= 0) {
    return '#28a745';
  }
  if (daysBehind >= 5) {
    return '#dc3545';
  }
  if (daysBehind >= 1 && daysBehind <= 4) {
    return '#ffc107';
  }
  return '#28a745';
};


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
          return cb(new BadRequestException('Solo se permiten archivos de imagen (jpg, jpeg, png, gif)'), false);
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
  async remove(@Param('id') id: string) {
    const proyectoId = +id;
    
    // 1. Obtener el proyecto
    const proyecto = await this.proyectoService.findOne(proyectoId);

    if (!proyecto) {
        throw new NotFoundException(`Proyecto con ID ${proyectoId} no encontrado.`);
    }

    // 2. Validación de Fase antes de Eliminar
    // Usamos el operador de coalescencia nula (??) para asegurar que si faseActual es null/undefined,
    // se trate como 1 para la validación.
    const faseActualSegura = proyecto.faseActual ?? 1; // Asume Fase 1 si es null/undefined

    if (faseActualSegura > 1) {
        throw new BadRequestException('El proyecto no puede ser eliminado porque ya ha iniciado la Fase 2 o superior. Solo los proyectos en Fase 1 pueden ser borrados.');
    }
    
    return this.proyectoService.remove(proyectoId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/concluir-fase')
  @UseInterceptors(
    FileInterceptor('documento', {
      storage: diskStorage({
        destination: './uploads/documentos_justificacion',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos PDF como documento de justificación!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10
      }
    })
  )
  async concluirFase(
    @Param('id') id: string,
    @UploadedFile() documento: Express.Multer.File,
    @Body('justificacion') justificacion: string,
  ) {
    if (!justificacion || justificacion.trim() === '') {
      throw new BadRequestException('La justificación es obligatoria para avanzar de fase.');
    }
    if (!documento) {
      throw new BadRequestException('Se requiere un documento PDF que avale el cambio de fase.');
    }

    const documentoUrl = `/uploads/documentos_justificacion/${documento.filename}`;
    
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

  // --- PASO 1: DESCARGAR Y PREPARAR LOGOS ---
  try {
    const [sepResponse, tecNmResponse, logoIzq1Response, logoIzq2Response] = await Promise.all([
      axios.get(SEP_LOGO_URL, { responseType: 'arraybuffer' }),
      axios.get(TECNM_LOGO_URL, { responseType: 'arraybuffer' }),
      axios.get(LOGO_IZQ_1_URL, { responseType: 'arraybuffer' }),
      axios.get(LOGO_IZQ_2_URL, { responseType: 'arraybuffer' }),
    ]);
    const sepImageBuffer = Buffer.from(sepResponse.data);
    const tecNmImageBuffer = Buffer.from(tecNmResponse.data);
    const logoIzq1Buffer = Buffer.from(logoIzq1Response.data);
    const logoIzq2Buffer = Buffer.from(logoIzq2Response.data);
  
    // --- PASO 2: ADJUNTAR ENCABEZADO Y PIE DE PÁGINA AL EVENTO pageAdded ---
    doc.on('pageAdded', () => {
      addHeader(doc, sepImageBuffer, tecNmImageBuffer);
      addFooter(doc, logoIzq1Buffer, logoIzq2Buffer); // Agregamos el footer en cada nueva página
    });

    // --- PASO 3: DIBUJAR ENCABEZADO Y PIE DE PÁGINA DE LA PRIMERA PÁGINA ---
    addHeader(doc, sepImageBuffer, tecNmImageBuffer);
    addFooter(doc, logoIzq1Buffer, logoIzq2Buffer);

  } catch (error) {
    console.error('Error al descargar los logos:', error.message);
    doc.fontSize(10).text('Error al cargar logos y encabezado/pie de página.', 50, 50);
    doc.y = 80; 
  }
  // --------------------------------------------------------

  // El texto del reporte comienza automáticamente en doc.y = HEADER_MARGIN_BOTTOM
  doc.y = HEADER_MARGIN_BOTTOM; 
  
  doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text('Reporte General de Avance de Proyectos', { align: 'center' });
  doc.moveDown(2);
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  if (proyectos.length === 0) {
    doc.fontSize(12).fillColor('#000000').text('No hay proyectos registrados en el sistema.', { align: 'center' });
  } else {
    proyectos.forEach((proyecto, index) => {
      const fase = proyecto.faseActual !== null ? proyecto.faseActual : 1; 
      const avance = calcularAvance(proyecto.fechaInicio, proyecto.fechaFinAprox, fase);
      const color = getProgressColor(proyecto.fechaInicio, proyecto.fechaFinAprox, fase);

      const yPos = doc.y;

      // Check if space is too close to footer and add page if necessary
      if (yPos > FOOTER_Y_POS - 70) {
        doc.addPage();
        doc.y = HEADER_MARGIN_BOTTOM;
      }
      

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text(`${index + 1}. ${proyecto.nombre}`, 50, doc.y);
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000000');
      
      const textStartX = 50;
      let currentTextY = doc.y;

      doc.font('Helvetica-Bold').text('Comunidad: ', textStartX, currentTextY, { continued: true })
          .font('Helvetica').text(`${proyecto.comunidad ? proyecto.comunidad.nombre : 'N/A'}`);
      currentTextY = doc.y + 5;

      doc.font('Helvetica-Bold').text('Población Beneficiada: ', textStartX, currentTextY, { continued: true })
          .font('Helvetica').text(`${proyecto.poblacionBeneficiada ? proyecto.poblacionBeneficiada.toLocaleString('en-US') : 'N/A'}`);
      currentTextY = doc.y + 5;

      doc.font('Helvetica-Bold').text('Avance: ', textStartX, currentTextY, { continued: true })
          .font('Helvetica').text(`Fase ${proyecto.faseActual !== null ? proyecto.faseActual : 'N/A'}(${avance}%)`);
      currentTextY = doc.y + 5;
      
      const progressBarWidth = 200;
      const progressBarHeight = 10;
      const progressX = doc.page.width - 50 - progressBarWidth; 
      const progressY = yPos + 18; 

      doc.rect(progressX, progressY, progressBarWidth, progressBarHeight).stroke('#e0e0e0');
      doc.rect(progressX, progressY, (avance / 100) * progressBarWidth, progressBarHeight).fill(color);
      
      const textX = progressX + (avance / 100) * progressBarWidth - 15;
      const textY = progressY + 2;
      doc.fontSize(8).fillColor('#000000').text(`${avance}%`, textX, textY);

      doc.y = Math.max(currentTextY, progressY + progressBarHeight) + 15;
      if (doc.y > FOOTER_Y_POS - 70) {
        doc.addPage();
        doc.y = HEADER_MARGIN_BOTTOM; // Reset y for new page, respetando el nuevo encabezado
      }
    });
  }
  let greenCount = 0;
  let yellowCount = 0;
  let redCount = 0;
  let greyCount = 0;
  proyectos.forEach(proyecto => {
      const fase = proyecto.faseActual !== null ? proyecto.faseActual : 1;
      const color = getProgressColor(proyecto.fechaInicio, proyecto.fechaFinAprox, fase);
      switch (color) {
          case '#28a745': greenCount++; break;
          case '#ffc107': yellowCount++; break;
          case '#dc3545': redCount++; break;
          default: greyCount++; break;
      }
  });

  const totalProjects = proyectos.length;
  
  const chartRadius = 50;
  const chartCenterX = 100;
  const chartCenterY = doc.y + chartRadius + 20;
  let currentAngle = 0;

  const drawSlice = (color: string, count: number) => {
      if (count === 0) return;
      const sliceAngle = (count / totalProjects) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      doc.save()
          .fill(color)
          .moveTo(chartCenterX, chartCenterY)
          .lineTo(
              chartCenterX + chartRadius * Math.cos(startAngle * Math.PI / 180),
              chartCenterY + chartRadius * Math.sin(startAngle * Math.PI / 180)
          )
          .path(`M ${chartCenterX} ${chartCenterY} L ${chartCenterX + chartRadius * Math.cos(startAngle * Math.PI / 180)} ${chartCenterY + chartRadius * Math.sin(startAngle * Math.PI / 180)} A ${chartRadius} ${chartRadius} 0 ${sliceAngle > 180 ? 1 : 0} 1 ${chartCenterX + chartRadius * Math.cos(endAngle * Math.PI / 180)} ${chartCenterY + chartRadius * Math.sin(endAngle * Math.PI / 180)} Z`)
          .fill(color);
      
      currentAngle += sliceAngle;
      doc.restore();
  };

  drawSlice('#28a745', greenCount);
  drawSlice('#ffc107', yellowCount);
  drawSlice('#dc3545', redCount);
  drawSlice('#6c757d', greyCount);
  
  const legendX = chartCenterX + chartRadius + 20;
  const legendY = chartCenterY - chartRadius + 10;
  const legendSpacing = 15;
  
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Resumen de Proyectos', legendX, legendY - 15);
  doc.fontSize(10).font('Helvetica').fillColor('#000000').text(`Total de Proyectos: ${totalProjects}`, legendX, legendY);

  if (greenCount > 0) {
      doc.fillColor('#28a745').text(`• En Tiempo: ${greenCount}`, legendX, legendY + legendSpacing);
  }
  if (yellowCount > 0) {
      doc.fillColor('#ffc107').text(`• Ligeramente Atrasados: ${yellowCount}`, legendX, legendY + legendSpacing * 2);
  }
  if (redCount > 0) {
      doc.fillColor('#dc3545').text(`• Muy Atrasados / Vencidos: ${redCount}`, legendX, legendY + legendSpacing * 3);
  }
  if (greyCount > 0) {
      doc.fillColor('#6c757d').text(`• Sin Fechas: ${greyCount}`, legendX, legendY + legendSpacing * 4);
  }
  
  doc.moveDown(6);

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

    // --- PASO 1: DESCARGAR Y PREPARAR LOGOS ---
    try {
      const [sepResponse, tecNmResponse, logoIzq1Response, logoIzq2Response] = await Promise.all([
        axios.get(SEP_LOGO_URL, { responseType: 'arraybuffer' }),
        axios.get(TECNM_LOGO_URL, { responseType: 'arraybuffer' }),
        axios.get(LOGO_IZQ_1_URL, { responseType: 'arraybuffer' }),
        axios.get(LOGO_IZQ_2_URL, { responseType: 'arraybuffer' }),
      ]);
      const sepImageBuffer = Buffer.from(sepResponse.data);
      const tecNmImageBuffer = Buffer.from(tecNmResponse.data);
      const logoIzq1Buffer = Buffer.from(logoIzq1Response.data);
      const logoIzq2Buffer = Buffer.from(logoIzq2Response.data);
    
      // --- PASO 2: ADJUNTAR ENCABEZADO Y PIE DE PÁGINA AL EVENTO pageAdded ---
      doc.on('pageAdded', () => {
        addHeader(doc, sepImageBuffer, tecNmImageBuffer);
        addFooter(doc, logoIzq1Buffer, logoIzq2Buffer);
      });

      // --- PASO 3: DIBUJAR ENCABEZADO Y PIE DE PÁGINA DE LA PRIMERA PÁGINA ---
      addHeader(doc, sepImageBuffer, tecNmImageBuffer);
      addFooter(doc, logoIzq1Buffer, logoIzq2Buffer);

    } catch (error) {
      console.error('Error al descargar los logos (reporte individual):', error.message);
      doc.fontSize(10).text('Error al cargar logos y encabezado/pie de página.', 50, 50);
      doc.y = 80; 
    }
    // --------------------------------------------------------

    // El texto del reporte comienza automáticamente en doc.y = HEADER_MARGIN_BOTTOM
    doc.y = HEADER_MARGIN_BOTTOM;

    doc.fontSize(14).font('Helvetica-Bold').text(`Reporte del Proyecto: ${project.nombre}`, { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('Información General:');
    doc.moveDown(1);

    doc.fontSize(12);

    doc.font('Helvetica-Bold').text('ID del Proyecto: ', { continued: true })
        .font('Helvetica').text(`${project.idProyecto}`);
    doc.moveDown(1);

    const fase = project.faseActual !== null ? project.faseActual : 1;
    const avance = calcularAvance(project.fechaInicio, project.fechaFinAprox, fase);
    const color = getProgressColor(project.fechaInicio, project.fechaFinAprox, fase);

    doc.font('Helvetica-Bold').text('Avance: ', { continued: true })
      .font('Helvetica').text(`Fase ${project.faseActual !== null ? project.faseActual : 'N/A'} (${avance}%)`);
    doc.moveDown(1);
    
    doc.font('Helvetica-Bold').text('Descripción: ', { continued: true })
        .font('Helvetica').text(`${project.descripcion || 'N/A'}`);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Comunidad: ', { continued: true })
        .font('Helvetica').text(`${project.comunidad ? project.comunidad.nombre : 'N/A'}`);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Población Beneficiada : ', { continued: true })
        .font('Helvetica').text(`${project.poblacionBeneficiada ? project.poblacionBeneficiada.toLocaleString('en-US') : 'N/A'}`);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Número de Capítulos: ', { continued: true })
        .font('Helvetica').text(`${project.noCapitulos || 'N/A'}`);
    doc.moveDown(1);

    // Ajustamos la función formatDate para aceptar 'Date | null'
    const formatDate = (date: Date | null) => {
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
      //doc.fontSize(14).font('Helvetica-Bold').text('Imágenes del Proyecto:');
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
          //doc.fontSize(12).font('Helvetica').text(`Imagen ${index + 1}: Archivo no encontrado en el servidor.`);
          //doc.moveDown(1);
        }
      });
    } else {
      //doc.fontSize(14).font('Helvetica-Bold').text('Imágenes del Proyecto:');
      //doc.moveDown(1);
      //doc.fontSize(12).font('Helvetica').text('No hay imágenes asociadas a este proyecto.');
      doc.moveDown(1);
    }
    doc.end();
  }
}
