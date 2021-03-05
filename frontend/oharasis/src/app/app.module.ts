import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Servicios
import { CriterioService } from './services/criterio.service';
import { EvaluacionService } from './services/evaluacion.service';
import { CursoService } from './services/curso.service';
import { CategoriaService } from './services/categoria.service';
import { UsuarioService } from './services/usuario.service';
import { LogroService } from './services/logro.service';
import { SoService } from './services/so.service';
import { RegCalificacionService } from './services/regCalificacion.service';
import { TipoService } from './services/tipo.service';
import { RegCalificacionSOService } from './services/regCalificacionSO.service';
import { RegEstudianteService } from './services/regEstudiante.service';
import { RegEvaluacionCriterioService } from './services/regEvaluacionCriterio.service';
import { RegHabilidadService } from './services/regHabilidad.service';
import { RegLogroService } from './services/regLogro.service';
import { AvatarTService } from './services/avatarT.service';
import { FregCalificacionService } from './services/fregCalificacion.service';
import { AuthenticationService } from './services/authentication.service';
import { StorageService } from './services/storage.service';
import { PiService } from './services/pi.service';
import { RegCalificacionPIService } from './services/regCalificacionPI.service';
import { GrupoService } from './services/grupo.service';
import { MessageService } from './services/message.service';

// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// Font-Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fas, far, fab);

// SweetAlert
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

// Rutas
import { app_routing } from './app.routes';

// pipes
import { RealNamePipe } from './pipes/real-name.pipe';
import { NombreCursoPipe } from './pipes/nombre-curso.pipe';

// modulos de vistas
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { LteNavBarComponent } from './components/shared/lte-nav-bar/lte-nav-bar.component';
import { LteLogotipoComponent } from './components/shared/lte-logotipo/lte-logotipo.component';
import { LteSideBarComponent } from './components/shared/lte-side-bar/lte-side-bar.component';
import { LteFooterComponent } from './components/shared/lte-footer/lte-footer.component';
import { LtePanelComponent } from './components/shared/lte-panel/lte-panel.component';

// Vistas
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
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
import { ChartsModule } from 'ng2-charts';
import { AvatarService } from './services/avatar.service';
import { ReporteCursosComponent } from './components/reporte-cursos/reporte-cursos.component';
import { ReporteCursoComponent } from './components/reporte-curso/reporte-curso.component';
import { MiCalificacionComponent } from './components/mi-calificacion/mi-calificacion.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AvatarSimpleComponent } from './components/avatar-simple/avatar-simple.component';
import { AgregarObservacionesComponent } from './components/agregar-observaciones/agregar-observaciones.component';
import { ObservacionService } from './services/observacion.service';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { EditarMiPerfilComponent } from './components/editar-mi-perfil/editar-mi-perfil.component';
import { AgregarPiComponent } from './components/agregar-pi/agregar-pi.component';
import { ConfigurarCursoComponent } from './components/configurar-curso/configurar-curso.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavBarComponent,
    LteNavBarComponent,
    LteLogotipoComponent,
    LteSideBarComponent,
    LteFooterComponent,
    HomeComponent,
    LtePanelComponent,
    HomeUserComponent,
    BlankComponent,
    BuscarCursosComponent,
    AgregarCriteriosComponent,
    BuscarEstudianteComponent,
    AsignarProfesorComponent,
    CalificarEstudianteComponent,
    AvatarComponent,
    CrearUsuariosComponent,
    MisLogrosComponent,
    EvaluacionesComponent,
    RealNamePipe,
    AgregarCursosComponent,
    AgregarCategoriasComponent,
    AgregarLogrosComponent,
    AgregarSoComponent,
    MatricularEstudianteComponent,
    AgregarTiposComponent,
    AgregarAvatarTComponent,
    EstudiantesComponent,
    ReporteCursosComponent,
    ReporteCursoComponent,
    NombreCursoPipe,
    MiCalificacionComponent,
    PerfilComponent,
    AvatarSimpleComponent,
    AgregarObservacionesComponent,
    AccesoDenegadoComponent,
    EditarMiPerfilComponent,
    AgregarPiComponent,
    ConfigurarCursoComponent
  ],
  imports: [
    BrowserModule,
    app_routing,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FontAwesomeModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    ChartsModule
  ],
  providers: [
    CriterioService,
    EvaluacionService,
    CursoService,
    CategoriaService,
    UsuarioService,
    LogroService,
    SoService,
    RegCalificacionService,
    TipoService,
    RegCalificacionSOService,
    RegEstudianteService,
    RegEvaluacionCriterioService,
    RegHabilidadService,
    RegLogroService,
    AvatarTService,
    AvatarService,
    FregCalificacionService,
    AuthenticationService,
    StorageService,
    ObservacionService,
    RegCalificacionPIService,
    PiService,
    GrupoService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
