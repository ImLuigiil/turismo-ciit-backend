// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Importa ConfigModule

// Importa TODOS tus módulos
import { ProyectoModule } from './proyecto/proyecto.module';
import { ComunidadModule } from './comunidad/comunidad.module';
import { ReunionModule } from './reunion/reunion.module';
import { AsignacionRecursoModule } from './asignacion-recurso/asignacion-recurso.module';
import { ComiteModule } from './comite/comite.module';
import { CapacitacionModule } from './capacitacion/capacitacion.module';
import { RecursoTuristicoModule } from './recurso-turistico/recurso-turistico.module';
import { ExperienciaTuristicaModule } from './experiencia-turistica/experiencia-turistica.module';
import { PromocionModule } from './promocion/promocion.module';
import { RolModule } from './rol/rol.module';
import { UsuarioModule } from './usuario/usuario.module';
import { DiplomadoModule } from './diplomado/diplomado.module';
import { CursoModule } from './curso/curso.module';
import { ProyectoResidenciaModule } from './proyecto-residencia/proyecto-residencia.module';
import { AuthModule } from './auth/auth.module';
import { PersonaProyectoModule } from './persona-proyecto/persona-proyecto.module';
import { SeedModule } from './seed/seed.module';
import { ProyectoImagenModule } from './proyecto-imagen/proyecto-imagen.module';

// Importa TODAS tus entidades para TypeOrmModule.forRoot
import { Proyecto } from './proyecto/proyecto.entity';
import { Comunidad } from './comunidad/comunidad.entity';
import { Reunion } from './reunion/reunion.entity';
import { AsignacionRecurso } from './asignacion-recurso/asignacion-recurso.entity';
import { Comite } from './comite/comite.entity';
import { Capacitacion } from './capacitacion/capacitacion.entity';
import { RecursoTuristico } from './recurso-turistico/recurso-turistico.entity';
import { ExperienciaTuristica } from './experiencia-turistica/experiencia-turistica.entity';
import { Promocion } from './promocion/promocion.entity';
import { Rol } from './rol/rol.entity';
import { Usuario } from './usuario/usuario.entity';
import { Diplomado } from './diplomado/diplomado.entity';
import { Curso } from './curso/curso.entity';
import { ProyectoResidencia } from './proyecto-residencia/proyecto-residencia.entity';
import { PersonaProyecto } from './persona-proyecto/persona-proyecto.entity';
import { ProyectoImagen } from './proyecto-imagen/proyecto-imagen.entity';


@Module({
  imports: [
    // Configura ConfigModule para cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigService esté disponible globalmente
    }),
    // Configura TypeORM para la conexión a la base de datos
    TypeOrmModule.forRoot({
      type: 'mysql',
      // --- CAMBIO CLAVE: Leer credenciales de variables de entorno ---
          host: process.env.MYSQL_ADDON_HOST,
          port: 3306,
          username: process.env.MYSQL_ADDON_USER,
          password: process.env.MYSQL_ADDON_PASSWORD,
          database: process.env.MYSQL_ADDON_DB,
      // --- FIN CAMBIO CLAVE ---
      entities: [
        // Lista todas tus entidades aquí para que TypeORM las reconozca
        Proyecto,
        Comunidad,
        Reunion,
        AsignacionRecurso,
        Comite,
        Capacitacion,
        RecursoTuristico,
        ExperienciaTuristica,
        Promocion,
        Rol,
        Usuario,
        Diplomado,
        Curso,
        ProyectoResidencia,
        PersonaProyecto,
        ProyectoImagen,
      ],
      // --- CAMBIO CLAVE: synchronize: false para producción ---
      synchronize: false, // ¡MUY IMPORTANTE: Cambiar a FALSE para producción!
      // En producción, se recomienda usar migraciones para gestionar el esquema de la DB.
      // Ejemplo de configuración de migraciones (si las implementas):
      // migrations: [__dirname + '/../dist/migrations/*.js'],
      // cli: { migrationsDir: 'src/migrations' },
    }),
    // Importa todos los módulos de tu aplicación
    ProyectoModule,
    ComunidadModule,
    ReunionModule,
    AsignacionRecursoModule,
    ComiteModule,
    CapacitacionModule,
    RecursoTuristicoModule,
    ExperienciaTuristicaModule,
    PromocionModule,
    RolModule,
    UsuarioModule,
    DiplomadoModule,
    CursoModule,
    ProyectoResidenciaModule,
    AuthModule, // Maneja la autenticación (JWT_SECRET se lee vía ConfigService)
    PersonaProyectoModule,
    SeedModule, // Módulo para el sembrado de datos (ejecución única)
    ProyectoImagenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
