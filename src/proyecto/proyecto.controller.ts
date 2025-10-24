import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards, UploadedFiles, UseInterceptors, BadRequestException, Res, Patch, UploadedFile, NotFoundException } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProyectoImagen } from '../proyecto-imagen/proyecto-imagen.entity';
// Importaciones para PDF
import * as PDFKit from 'pdfkit'; 
import { PDFDocument, StandardFonts, rgb, PDFPage } from 'pdf-lib'; 
import { Response } from 'express';
import * as fs from 'fs';
import axios from 'axios';
import { Proyecto } from './proyecto.entity';

// Configuración de rutas (VERIFICA ESTA RUTA EN TU PROYECTO)
const TEMPLATE_PDF_PATH = join(process.cwd(), 'assets', 'hojamembretada.pdf');

// =========================================================================
// CONSTANTES Y FUNCIONES AUXILIARES (AJUSTADAS)
// =========================================================================

// Coordenadas y estilos para estampar el contenido en la plantilla
const START_X = 90; // Margen izquierdo
const INDENT_X_SMALL = 85; // <--- LA CONSTANTE QUE CAUSA PROBLEMAS
const INDENT_X_BIG = 150; // Indentación mayor
const INDENT_X_VALUE = 240; // Posición de los valores
const CONTENT_START_Y = 670; // Posición Y de inicio
const CONTENT_END_Y = 140; // Límite inferior
const LINE_SPACING = 25; // Espaciado entre bloques principales
const LINE_SPACING_ITEM = 20; // Espaciado entre ítems
const LINE_SPACING_SMALL = 16; // Espaciado para sub-ítems


const getPhaseSchedule = (fechaInicio: Date | null, fechaFinAprox: Date | null) => {
    if (!fechaInicio || !fechaFinAprox) return [];
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFinAprox);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate) return [];
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
    if ((faseActual ?? 0) >= 7) return 100;
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

type ProgressColor = '#28a745' | '#ffc107' | '#dc3545' | '#6c757d'; 

const getProgressColor = (fechaInicio: Date | null, fechaFinAprox: Date | null, faseActual: number | null): ProgressColor => {
    if (!fechaInicio || !fechaFinAprox || faseActual === null || faseActual < 1) return '#28a745';
    if (faseActual === 7) return '#28a745';
    const currentDate = new Date();
    const endDate = new Date(fechaFinAprox);
    if (currentDate > endDate) return '#dc3545';
    const schedule = getPhaseSchedule(fechaInicio, fechaFinAprox);
    if (schedule.length === 0) return '#28a745';
    const expectedEndDateForCurrentPhase = schedule[faseActual - 1];
    if (!expectedEndDateForCurrentPhase) return '#28a745'; 

    const timeDifference = currentDate.getTime() - expectedEndDateForCurrentPhase.getTime();
    const daysBehind = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (daysBehind <= 0) return '#28a745';
    if (daysBehind >= 5) return '#dc3545';
    if (daysBehind >= 1 && daysBehind <= 4) return '#ffc107';
    return '#28a745';
};

const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

// =========================================================================
// FIN CONSTANTES Y FUNCIONES AUXILIARES
// =========================================================================


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
        
        const proyecto = await this.proyectoService.findOne(proyectoId);

        if (!proyecto) {
            throw new NotFoundException(`Proyecto con ID ${proyectoId} no encontrado.`);
        }

        const faseActualSegura = proyecto.faseActual ?? 1;

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
    
    /**
     * Helper para agregar una página con el sello de la hoja membretada
     * y resetear la posición Y
     */
    private async addTemplatePage(pdfDoc: PDFDocument, templateDoc: PDFDocument): Promise<[PDFPage, number]> {
        const [templatePage] = await pdfDoc.copyPages(templateDoc, [0]);
        const newPage = pdfDoc.addPage(templatePage);
        return [newPage, CONTENT_START_Y]; // Retorna la nueva página y la posición Y de inicio
    }

    // =========================================================================
    // REPORTE GENERAL (USA HOJA MEMBRETADA, MÚLTIPLES PÁGINAS Y RESUMEN VISUAL)
    // =========================================================================

    @Get('report/general')
    @UseGuards(AuthGuard('jwt'))
    async generateGeneralReport(@Res() res: Response) {
        const proyectos = await this.proyectoService.findAll();

        if (!fs.existsSync(TEMPLATE_PDF_PATH)) {
            throw new NotFoundException(`No se encontró la plantilla PDF en: ${TEMPLATE_PDF_PATH}`);
        }

        try {
            // Cargar la plantilla y el nuevo documento
            const existingPdfBytes = fs.readFileSync(TEMPLATE_PDF_PATH);
            const templateDoc = await PDFDocument.load(existingPdfBytes);
            const pdfDoc = await PDFDocument.create();
            
            const { width } = templateDoc.getPages()[0].getSize();
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            
            const TEXT_COLOR = rgb(0, 0, 0);

            // 1. Configurar la primera página (USANDO ASIGNACIÓN CLÁSICA PARA EVITAR ERROR 2488)
            const firstPageResult = await this.addTemplatePage(pdfDoc, templateDoc);
            let page: PDFPage = firstPageResult[0];
            let currentY: number = firstPageResult[1];
            
            // 2. Título principal
            currentY -= LINE_SPACING;
            page.drawText('Reporte General de Avance de Proyectos', { 
                x: START_X, 
                y: currentY, 
                font: helveticaBoldFont, 
                size: 16,
                maxWidth: width - START_X * 2,
                color: TEXT_COLOR
            });
            currentY -= LINE_SPACING * 2;
            
            if (proyectos.length === 0) {
                page.drawText('No hay proyectos registrados en el sistema.', { x: START_X, y: currentY, font: helveticaFont, size: 12, color: TEXT_COLOR });
            } else {
                
                proyectos.forEach((proyecto, index) => {
                    const fase = proyecto.faseActual !== null ? proyecto.faseActual : 1; 
                    const avance = calcularAvance(proyecto.fechaInicio, proyecto.fechaFinAprox, fase);
                    const colorHex = getProgressColor(proyecto.fechaInicio, proyecto.fechaFinAprox, fase);
                    
                    // Si el contenido se acerca al límite inferior, añade una nueva página
                    if (currentY < CONTENT_END_Y + LINE_SPACING * 3) {
                        const newPageResult = this.addTemplatePage(pdfDoc, templateDoc);
                        page = newPageResult[0];
                        currentY = newPageResult[1] - LINE_SPACING;
                    }
                    
                    currentY -= LINE_SPACING * 1.5;

                    // Nombre del proyecto
                    page.drawText(`${index + 1}. ${proyecto.nombre}`, { 
                        x: START_X, 
                        y: currentY, 
                        font: helveticaBoldFont, 
                        size: 12,
                        color: TEXT_COLOR,
                        maxWidth: width - START_X * 2,
                    });
                    currentY -= LINE_SPACING_SMALL;
                    
                    // Avance y Fase
                    page.drawText('Avance: ', { x: START_X, y: currentY, font: helveticaBoldFont, size: 10, color: TEXT_COLOR });
                    page.drawText(`Fase ${proyecto.faseActual !== null ? proyecto.faseActual : 'N/A'} (${avance}%)`, { x: START_X + 50, y: currentY, font: helveticaFont, size: 10, color: TEXT_COLOR });
                    
                    // Barra de Progreso
                    const progressBarWidth = 150;
                    const progressBarHeight = 8;
                    const progressX = width - START_X - progressBarWidth; 
                    const progressY = currentY + 1; 
                    
                    // Conversión de color Hex a RGB para PDF-LIB
                    const barColor = colorHex === '#dc3545' ? rgb(0.86, 0.2, 0.27) : 
                                     colorHex === '#ffc107' ? rgb(1, 0.76, 0.28) : 
                                     colorHex === '#28a745' ? rgb(0.16, 0.65, 0.27) : rgb(0.5, 0.5, 0.5);
                    
                    // Fondo
                    page.drawRectangle({
                        x: progressX, 
                        y: progressY, 
                        width: progressBarWidth, 
                        height: progressBarHeight,
                        color: rgb(0.9, 0.9, 0.9),
                        borderColor: rgb(0.7, 0.7, 0.7),
                        borderWidth: 0.5,
                    });

                    // Progreso
                    page.drawRectangle({
                        x: progressX, 
                        y: progressY, 
                        width: (avance / 100) * progressBarWidth, 
                        height: progressBarHeight,
                        color: barColor,
                    });
                    
                    currentY -= LINE_SPACING_SMALL;
                });
            }

            // 3. Resumen y Gráfico
            if (currentY < CONTENT_END_Y + LINE_SPACING * 8) {
                const newPageResult = await this.addTemplatePage(pdfDoc, templateDoc);
                page = newPageResult[0];
                currentY = newPageResult[1];
            }
            currentY -= LINE_SPACING * 2;
            
            // Lógica del conteo de colores
            let greenCount = 0; let yellowCount = 0; let redCount = 0; let greyCount = 0;
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
            
            page.drawText('Resumen de Proyectos por Estado:', { 
                x: START_X, 
                y: currentY, 
                font: helveticaBoldFont, 
                size: 14,
                color: TEXT_COLOR
            });
            currentY -= LINE_SPACING;

            // ⚠️ IMPLEMENTACIÓN DE LEYENDA VISUAL SIMPLE (SUSTITUTO DEL GRÁFICO DE PASTEL)
            const legendBlockSize = 8;
            let legendY = currentY;

            page.drawText(`Total de Proyectos: ${totalProjects}`, { x: START_X, y: legendY, font: helveticaBoldFont, size: 11, color: TEXT_COLOR });
            legendY -= LINE_SPACING_SMALL;

            if (greenCount > 0) {
                page.drawRectangle({x: START_X, y: legendY, width: legendBlockSize, height: legendBlockSize, color: rgb(0.16, 0.65, 0.27)});
                page.drawText(`En Tiempo / Concluidos: ${greenCount}`, { x: START_X + 15, y: legendY, font: helveticaFont, size: 11, color: TEXT_COLOR });
                legendY -= LINE_SPACING_SMALL;
            }
            if (yellowCount > 0) {
                page.drawRectangle({x: START_X, y: legendY, width: legendBlockSize, height: legendBlockSize, color: rgb(1, 0.76, 0.28)});
                page.drawText(`Ligeramente Atrasados: ${yellowCount}`, { x: START_X + 15, y: legendY, font: helveticaFont, size: 11, color: TEXT_COLOR });
                legendY -= LINE_SPACING_SMALL;
            }
            if (redCount > 0) {
                page.drawRectangle({x: START_X, y: legendY, width: legendBlockSize, height: legendBlockSize, color: rgb(0.86, 0.2, 0.27)});
                page.drawText(`Muy Atrasados / Vencidos: ${redCount}`, { x: START_X + 15, y: legendY, font: helveticaFont, size: 11, color: TEXT_COLOR });
                legendY -= LINE_SPACING_SMALL;
            }
            currentY = legendY; 

            // 4. Serializar y enviar
            const filename = `reporte_general_proyectos_${new Date().toISOString().split('T')[0]}.pdf`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            const pdfBytes = await pdfDoc.save();
            res.send(Buffer.from(pdfBytes));

        } catch (error) {
            console.error('Error al generar el reporte general (PDF-LIB):', error.message);
            res.status(500).send('Error interno al generar el reporte general.');
        }
    }


    // =========================================================================
    // REPORTE INDIVIDUAL (ESPACIADO CORREGIDO Y ALINEACIÓN DE ROLES)
    // =========================================================================

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

        if (!fs.existsSync(TEMPLATE_PDF_PATH)) {
             throw new NotFoundException(`No se encontró la plantilla PDF en: ${TEMPLATE_PDF_PATH}`);
        }

        try {
            // Cargar el PDF de la plantilla
            const existingPdfBytes = fs.readFileSync(TEMPLATE_PDF_PATH);
            const templateDoc = await PDFDocument.load(existingPdfBytes);
            const pdfDoc = await PDFDocument.create();

            // Configurar la primera página
            const firstPageResult = await this.addTemplatePage(pdfDoc, templateDoc);
            const firstPage: PDFPage = firstPageResult[0];
            let currentY: number = firstPageResult[1];

            const { width } = firstPage.getSize();
            const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // Configurar respuesta HTTP
            const filename = `reporte_proyecto_${project.idProyecto}.pdf`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

            // Colores
            const TEXT_COLOR = rgb(0, 0, 0); 
            const TITLE_COLOR = rgb(0.2, 0.2, 0.2); 
            const textWidth = width - (START_X * 2);

            // Título del Reporte
            currentY -= LINE_SPACING;
            firstPage.drawText(`Reporte del Proyecto: ${project.nombre}`, {
                x: START_X,
                y: currentY,
                font: helveticaBoldFont,
                size: 16,
                maxWidth: textWidth,
                color: TEXT_COLOR,
            });
            currentY -= LINE_SPACING * 1.5;

            // Información General
            firstPage.drawText('Información General:', { 
                x: START_X, 
                y: currentY, 
                font: helveticaBoldFont,
                size: 14,
                color: TITLE_COLOR,
            });
            currentY -= LINE_SPACING;
            
            // ID del Proyecto
            firstPage.drawText('ID del Proyecto: ', { x: START_X, y: currentY, font: helveticaBoldFont, size: 12, color: TEXT_COLOR });
            firstPage.drawText(`${project.idProyecto}`, { x: INDENT_X_VALUE, y: currentY, font: helveticaFont, size: 12, color: TEXT_COLOR });
            currentY -= LINE_SPACING_ITEM;

            // Avance
            const fase = project.faseActual !== null ? project.faseActual : 1;
            const avance = calcularAvance(project.fechaInicio, project.fechaFinAprox, fase);
            firstPage.drawText('Avance: ', { x: START_X, y: currentY, font: helveticaBoldFont, size: 12, color: TEXT_COLOR });
            firstPage.drawText(`Fase ${fase} (${avance}%)`, { x: INDENT_X_VALUE, y: currentY, font: helveticaFont, size: 12, color: TEXT_COLOR });
            currentY -= LINE_SPACING_ITEM;

            // Fechas
            firstPage.drawText('Fecha Inicio: ', { x: START_X, y: currentY, font: helveticaBoldFont, size: 12, color: TEXT_COLOR });
            firstPage.drawText(`${formatDate(project.fechaInicio)}`, { x: INDENT_X_VALUE, y: currentY, font: helveticaFont, size: 12, color: TEXT_COLOR });
            currentY -= LINE_SPACING_ITEM;

            firstPage.drawText('Fecha Fin Aprox: ', { x: START_X, y: currentY, font: helveticaBoldFont, size: 12, color: TEXT_COLOR });
            firstPage.drawText(`${formatDate(project.fechaFinAprox)}`, { x: INDENT_X_VALUE, y: currentY, font: helveticaFont, size: 12, color: TEXT_COLOR });
            currentY -= LINE_SPACING_ITEM * 1.5;


            // Descripción (alineación mejorada)
            firstPage.drawText('Descripción: ', { x: START_X, y: currentY, font: helveticaBoldFont, size: 12, color: TEXT_COLOR });
            
            const descriptionText = project.descripcion || 'N/A';
            const descriptionWrapWidth = textWidth - INDENT_X_VALUE + START_X; // Ancho disponible desde el valor

            const charsPerLine = Math.floor(descriptionWrapWidth / 5.5);
            const descriptionLines = descriptionText.match(new RegExp(`.{1,${charsPerLine}}`, 'g')) || [descriptionText]; 

            let currentXDesc = INDENT_X_VALUE; 
            for (const line of descriptionLines) {
                if (currentY < CONTENT_END_Y + LINE_SPACING) break; 
                
                firstPage.drawText(line.trim(), {
                    x: currentXDesc, 
                    y: currentY,
                    font: helveticaFont,
                    size: 11,
                    maxWidth: descriptionWrapWidth,
                    color: TEXT_COLOR,
                });
                currentY -= LINE_SPACING_SMALL * 0.9;
                currentXDesc = INDENT_X_VALUE; 
            }
            currentY -= LINE_SPACING * 0.5; 
            
            // Comunidad y Población
            firstPage.drawText('Comunidad: ', { x: START_X, y: currentY, font: helveticaBoldFont, size: 12, color: TEXT_COLOR });
            firstPage.drawText(`${project.comunidad ? project.comunidad.nombre : 'N/A'}`, { x: INDENT_X_VALUE, y: currentY, font: helveticaFont, size: 12, color: TEXT_COLOR });
            currentY -= LINE_SPACING_ITEM;
            
            firstPage.drawText('Población Beneficiada: ', { x: START_X, y: currentY, font: helveticaBoldFont, size: 12, color: TEXT_COLOR });
            firstPage.drawText(`${project.poblacionBeneficiada ? project.poblacionBeneficiada.toLocaleString('en-US') : 'N/A'}`, { x: INDENT_X_VALUE + 40, y: currentY, font: helveticaFont, size: 12, color: TEXT_COLOR });
            currentY -= LINE_SPACING * 2;

            // Personas Involucradas
            if (currentY < CONTENT_END_Y + LINE_SPACING * 4) {
                 currentY = Math.max(currentY, CONTENT_END_Y + LINE_SPACING * 4); 
            }
            
            firstPage.drawText('Personas Involucradas:', { x: START_X, y: currentY, font: helveticaBoldFont, size: 14, color: TITLE_COLOR });
            currentY -= LINE_SPACING;

            if (project.personasDirectorio && project.personasDirectorio.length > 0) {
                project.personasDirectorio.forEach(persona => {
                    if (currentY < CONTENT_END_Y + LINE_SPACING) return; 
                    
                    const nombreCompleto = `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno || ''}`;
                    
                    firstPage.drawText(`• ${nombreCompleto}`, { x: START_X, y: currentY, font: helveticaBoldFont, size: 12, color: TEXT_COLOR });
                    currentY -= LINE_SPACING_SMALL;
                    
                    if (persona.rolEnProyecto) {
                        firstPage.drawText('Rol: ', { x: START_X + INDENT_X_SMALL, y: currentY, font: helveticaBoldFont, size: 10, color: TEXT_COLOR });
                        firstPage.drawText(`${persona.rolEnProyecto}`, { x: START_X + INDENT_X_SMALL + 25, y: currentY, font: helveticaFont, size: 10, color: TEXT_COLOR });
                        currentY -= LINE_SPACING_SMALL;
                    }
                    currentY -= LINE_SPACING_SMALL * 0.5;
                });
            } else {
                firstPage.drawText('No hay personas involucradas registradas.', { x: START_X, y: currentY, font: helveticaFont, size: 12, color: TEXT_COLOR });
            }
            
            // Serializar y enviar el PDF modificado
            const pdfBytes = await pdfDoc.save();
            res.send(Buffer.from(pdfBytes));

        } catch (error) {
            console.error('Error al generar el reporte sobre la plantilla (PDF-LIB):', error.message);
            res.status(500).send('Error interno al generar el reporte usando la plantilla PDF.');
        }
    }
}