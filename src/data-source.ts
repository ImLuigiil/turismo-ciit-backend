// src/data-source.ts
import { DataSource } from 'typeorm';
// Importa TODAS tus entidades aquí
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
    password: '', // ¡Importante: ajusta tu contraseña aquí!
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
    migrations: ["src/migrations/*.ts"], // Apunta a la ubicación de tus archivos de migración
    synchronize: false, // ¡Siempre false cuando uses migraciones!
    logging: true, // Útil para ver logs de la base de datos
});

// ¡OPCIONAL! Si quieres que TypeORM use este archivo por defecto sin --dataSource
// puedes añadir esto en tu package.json bajo "scripts":
// "typeorm": "typeorm-ts-node-commonjs -d src/data-source.ts"