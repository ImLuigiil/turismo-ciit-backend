
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
import { HistorialFaseModule } from './historial-fase/historial-fase.module';
import { HistorialFase } from './historial-fase/historial-fase.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
          host: process.env.MYSQL_ADDON_HOST,
          port: 3306,
          username: process.env.MYSQL_ADDON_USER,
          password: process.env.MYSQL_ADDON_PASSWORD,
          database: process.env.MYSQL_ADDON_DB,
      entities: [
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
        HistorialFase,
      ],
      synchronize: false, 
    }),
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
    AuthModule,
    PersonaProyectoModule,
    SeedModule,
    ProyectoImagenModule,
    HistorialFaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
