import { DataSource } from 'typeorm';
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

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'turismobd',
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
        ProyectoResidencia
    ],
    migrations: ["src/migrations/*.ts"],
    synchronize: false, 
    logging: true, 
});