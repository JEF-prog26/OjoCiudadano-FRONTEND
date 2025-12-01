import { Routes } from '@angular/router';
import { HomeComponent } from './Componente/home-component/home-component';
import { SobreNosotrosComponent } from './Componente/sobre-nosotros-component/sobre-nosotros-component';
import { QueEsComponent } from './Componente/que-es-component/que-es-component';
import { LoginComponent } from './Componente/login-component/login-component';
import { PanelEvidenciaComponent } from './Componente/panel-evidencia-component/panel-evidencia-component';
import { PanelNotificacionComponent } from './Componente/panel-notificacion-component/panel-notificacion-component';
import {PanelDenunciaComponent} from './Componente/panel-denuncia-component/panel-denuncia-component';
import {RegistrarUsuarioComponent} from './Componente/registrar-usuario-component/registrar-usuario-component';
import {PanelUsuarioComponent} from './Componente/panel-usuario-component/panel-usuario-component';
import {DashboardComponent} from './Componente/dashboard-component/dashboard-component';
import {PanelObraPublicaComponent} from './Componente/panel-obra-publica-component/panel-obra-publica-component';
import {
  PanelExpedienteTecnicoComponent
} from './Componente/panel-expediente-tecnico-component/panel-expediente-tecnico-component';
import {
  PanelGobiernoRegionalComponent
} from './Componente/panel-gobierno-regional-component/panel-gobierno-regional-component';
import { PanelInversionComponent } from './Componente/panel-inversion-component/panel-inversion-component';
import {PanelAvanceObraComponent} from './Componente/panel-avance-obra-component/panel-avance-obra-component';
import {PanelComentarioComponent} from './Componente/panel-comentario-component/panel-comentario-component';
import {
  PanelSeguimientoObraComponent
} from './Componente/panel-seguimiento-obra-component/panel-seguimiento-obra-component';


export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'que-es', component: QueEsComponent },
  { path: 'login', component: LoginComponent },

  // --- RUTAS PRIVADAS (DASHBOARD) ---
  { path: 'dashboard', component: DashboardComponent},

  // Paneles de gestión
  { path: 'panel-usuarios', component: PanelUsuarioComponent },
  { path: 'panel-notificaciones', component: PanelNotificacionComponent },
  { path: 'panel-expedientes-tecnicos', component: PanelExpedienteTecnicoComponent },
  { path: 'panel-gobiernos-regionales', component: PanelGobiernoRegionalComponent },
  { path: 'panel-obras-publicas', component: PanelObraPublicaComponent },
  { path: 'panel-denuncias', component: PanelDenunciaComponent },
  { path: 'panel-evidencias', component: PanelEvidenciaComponent },
  { path: 'panel-inversiones', component: PanelInversionComponent },
  { path: 'panel-avance-obras', component: PanelAvanceObraComponent },
  { path: 'panel-comentarios', component: PanelComentarioComponent },
  { path: 'panel-seguimiento-obras', component: PanelSeguimientoObraComponent },


  // --- GESTIÓN DE USUARIOS (CREAR Y EDITAR) ---
  // Ruta para CREAR (Sin ID)
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  // Ruta para EDITAR (Con ID)
  { path: 'registrar-usuario/:id', component: RegistrarUsuarioComponent },
  { path: 'registrar-notificacion', component: PanelNotificacionComponent },
  { path: 'registrar-notificacion/:id', component: PanelNotificacionComponent },
  { path: 'registrar-expediente-tecnico', component: PanelExpedienteTecnicoComponent },
  { path: 'registrar-expediente-tecnico/:id', component: PanelExpedienteTecnicoComponent },
  { path: 'registrar-gobierno-regional', component: PanelGobiernoRegionalComponent },
  { path: 'registrar-gobierno-regional/:id', component: PanelGobiernoRegionalComponent },
  { path: 'registrar-obra-publica', component: PanelObraPublicaComponent },
  { path: 'registrar-obra-publica/:id', component: PanelObraPublicaComponent },
  { path: 'registrar-denuncia', component: PanelDenunciaComponent },
  { path: 'registrar-denuncia/:id', component: PanelDenunciaComponent },
  { path: 'registrar-evidencia', component: PanelEvidenciaComponent },
  { path: 'registrar-evidencia/:id', component: PanelEvidenciaComponent },
  { path: 'registrar-inversion', component: PanelInversionComponent },
  { path: 'registrar-inversion/:id', component: PanelInversionComponent },
  { path: 'registrar-avance-obra', component: PanelAvanceObraComponent },
  { path: 'registrar-avance-obra/:id', component: PanelAvanceObraComponent },
  { path: 'registrar-comentario', component: PanelComentarioComponent },
  { path: 'registrar-comentario/:id', component: PanelComentarioComponent },
  { path: 'registrar-seguimiento-obra', component: PanelSeguimientoObraComponent },
  { path: 'registrar-seguimiento-obra/:id', component: PanelSeguimientoObraComponent },

  // (Opcional) Ruta comodín: Si escriben cualquier cosa rara, van al home
  { path:'**', component:HomeComponent}
];
