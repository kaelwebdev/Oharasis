import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { HomeUserComponent } from './components/home-user/home-user.component';
import { BlankComponent } from './components/blank/blank.component';
import { BuscarCursosComponent } from './components/buscar-cursos/buscar-cursos.component';
import { AgregarCriteriosComponent } from './components/agregar-criterios/agregar-criterios.component';
import { BuscarEstudianteComponent } from './components/buscar-estudiante/buscar-estudiante.component';
import { AsignarProfesorComponent } from './components/asignar-profesor/asignar-profesor.component';
import { CalificarEstudianteComponent } from './components/calificar-estudiante/calificar-estudiante.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { CrearUsuariosComponent } from './components/crear-usuarios/crear-usuarios.component';
import { MisLogrosComponent } from './components/mis-logros/mis-logros.component';
import { EvaluacionesComponent } from './components/evaluaciones/evaluaciones.component';
import { AgregarCursosComponent } from './components/agregar-cursos/agregar-cursos.component';
import { AgregarCategoriasComponent } from './components/agregar-categorias/agregar-categorias.component';
import { AgregarLogrosComponent } from './components/agregar-logros/agregar-logros.component';
import { AgregarSoComponent } from './components/agregar-so/agregar-so.component';
import { MatricularEstudianteComponent } from './components/matricular-estudiante/matricular-estudiante.component';
import { AgregarTiposComponent } from './components/agregar-tipos/agregar-tipos.component';
import { AgregarAvatarTComponent } from './components/agregar-avatar-t/agregar-avatar-t.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { ReporteCursosComponent } from './components/reporte-cursos/reporte-cursos.component';
import { ReporteCursoComponent } from './components/reporte-curso/reporte-curso.component';
import { MiCalificacionComponent } from './components/mi-calificacion/mi-calificacion.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AvatarSimpleComponent } from './components/avatar-simple/avatar-simple.component';
import { AgregarObservacionesComponent } from './components/agregar-observaciones/agregar-observaciones.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { EditarMiPerfilComponent } from './components/editar-mi-perfil/editar-mi-perfil.component';
import { AgregarPiComponent } from './components/agregar-pi/agregar-pi.component';
import { ConfigurarCursoComponent } from './components/configurar-curso/configurar-curso.component';
// guards
import { AuthorizatedGuard } from './services/authorizated-guard.service';

  const app_routes: Routes = [
    { path: 'user', component: HomeUserComponent, canActivate: [ AuthorizatedGuard ],
        data: {roles: ['Estudiante', 'Profesor', 'Director', 'Admin']},
        children: [
          // { path: '', redirectTo: 'BlankComponent', pathMatch: 'full' },
          { path: '', component: BlankComponent, pathMatch: 'full' },
          { path: 'buscarCursos', component: BuscarCursosComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Estudiante', 'Profesor', 'Director']} },
          { path: 'agregarCriterios/:id', component: AgregarCriteriosComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Profesor', 'Director']} },
          { path: 'buscarUsuario', component: BuscarEstudianteComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Estudiante', 'Profesor', 'Director', 'Admin']} },
          { path: 'asignarProfesor', component: AsignarProfesorComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Director', 'Admin']} },
          { path: 'calificarEstudiante/:idEstudiante/:idCurso', component: CalificarEstudianteComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Profesor', 'Director']} },
          { path: 'avatar/:idEstudiante/:idCurso', component: AvatarComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Profesor', 'Director']} },
          { path: 'mi-avatar', component: AvatarComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Estudiante']} },
          { path: 'crearUsuarios', component: CrearUsuariosComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Admin']} },
          { path: 'misLogros', component: MisLogrosComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Estudiante']} },
          { path: 'evaluaciones/:idCurso', component: EvaluacionesComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Profesor']} },
          { path: 'agregarCursos', component: AgregarCursosComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Admin']} },
          { path: 'agregarCategorias', component: AgregarCategoriasComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Admin']} },
          { path: 'agregarLogros', component: AgregarLogrosComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Admin']} },
          { path: 'agregarSo', component: AgregarSoComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Admin']} },
          { path: 'matricularEstudiante', component: MatricularEstudianteComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Admin']} },
          { path: 'agregarTipos', component: AgregarTiposComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Admin']}},
          { path: 'agregarAvatar', component: AgregarAvatarTComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Admin']}},
          { path: 'estudiantes/:idCurso', component: EstudiantesComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Profesor', 'Director']}},
          { path: 'reporteCurso/:idCurso', component: ReporteCursoComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Profesor', 'Director']}},
          { path: 'reporteCursos/:idsCurso', component: ReporteCursosComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Director']}},
          { path: 'miCalificacion/:idEstudiante/:idCurso', component: MiCalificacionComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Estudiante']} },
          { path: 'perfil/:d_idU', component: PerfilComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Estudiante', 'Profesor', 'Director', 'Admin']} },
          { path: 'mi-perfil', component: PerfilComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Estudiante', 'Profesor', 'Director', 'Admin']} },
          { path: 'editar-mi-perfil', component: EditarMiPerfilComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Estudiante', 'Profesor', 'Director', 'Admin']} },
          { path: 'estudianteAvatar/:idEstudiante', component: AvatarSimpleComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Estudiante', 'Profesor', 'Director', 'Admin']} },
          { path: 'agregar-observacion/:idEstudiante/:idCurso', component: AgregarObservacionesComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Profesor']} },
          { path: 'agregar-pi', component: AgregarPiComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Admin']} },
          { path: 'configurar-curso/:idCurso', component: ConfigurarCursoComponent, canActivate: [ AuthorizatedGuard ],
          data: {roles: ['Profesor']} }
      ] },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'acceso-denegado', component: AccesoDenegadoComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
  ];

  export const app_routing = RouterModule.forRoot(app_routes, {useHash: false,  enableTracing: false});
