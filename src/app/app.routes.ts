import { Routes } from '@angular/router';
import { HomeComponent } from './Componente/home-component/home-component';
import { SobreNosotrosComponent } from './Componente/sobre-nosotros-component/sobre-nosotros-component';
import { QueEsComponent } from './Componente/que-es-component/que-es-component';
import { LoginComponent } from './Componente/login-component/login-component';
import { PanelEvidenciaComponent } from './Componente/panel-evidencia-component/panel-evidencia-component';
import { PanelNotificacionComponent } from './Componente/panel-notificacion-component/panel-notificacion-component';
import {PanelDenunciaComponent} from './Componente/panel-denuncia-component/panel-denuncia-component';
import {PanelComentarioComponent} from './Componente/panel-comentario-component/panel-comentario-component';
import {PanelSeguimientoObraComponent} from './Componente/panel-seguimiento-obra-component/panel-seguimiento-obra-component';



export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'que-es', component: QueEsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'comentarios', component: PanelComentarioComponent },
  { path: 'evidencias', component: PanelEvidenciaComponent },
  { path: 'notificaciones', component: PanelNotificacionComponent },
  { path: 'seguimientoobra', component: PanelSeguimientoObraComponent },


  { path: 'panel-denuncias', component: PanelDenunciaComponent },

  { path:'**', component:HomeComponent}
];
