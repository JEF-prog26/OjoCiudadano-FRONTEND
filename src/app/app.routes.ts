import { Routes } from '@angular/router';
import { HomeComponent } from './Componente/home-component/home-component';
import { SobreNosotrosComponent } from './Componente/sobre-nosotros-component/sobre-nosotros-component';
import { QueEsComponent } from './Componente/que-es-component/que-es-component';
import { LoginComponent } from './Componente/login-component/login-component';
import { PanelEvidenciaComponent } from './Componente/panel-evidencia-component/panel-evidencia-component';
import { PanelNotificacionComponent } from './Componente/panel-notificacion-component/panel-notificacion-component';
import {PanelDenunciaComponent} from './Componente/panel-denuncia-component/panel-denuncia-component';
import {
  PanelExpedienteTecnicoComponent
} from './Componente/panel-expediente-tecnico-component/panel-expediente-tecnico-component';


export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'que-es', component: QueEsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'evidencias', component: PanelEvidenciaComponent },
  { path: 'notificaciones', component: PanelNotificacionComponent },

  { path: 'panel-denuncias', component: PanelDenunciaComponent },
  { path: 'panel-expedientes-tecnicos', component: PanelExpedienteTecnicoComponent},

  { path:'**', component:HomeComponent}
];
