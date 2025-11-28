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


export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'que-es', component: QueEsComponent },
  { path: 'login', component: LoginComponent },

  // --- RUTAS PRIVADAS (DASHBOARD) ---
  { path: 'dashboard', component: DashboardComponent},

  // Paneles de gestión
  { path: 'evidencias', component: PanelEvidenciaComponent },
  { path: 'notificaciones', component: PanelNotificacionComponent },
  { path: 'panel-denuncias', component: PanelDenunciaComponent },
  { path: 'panel-usuarios', component: PanelUsuarioComponent },
  { path: 'panel-obra-publica', component: PanelObraPublicaComponent },

  // --- GESTIÓN DE USUARIOS (CREAR Y EDITAR) ---
  // Ruta para CREAR (Sin ID)
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  // Ruta para EDITAR (Con ID) <- ¡ESTA ES LA QUE FALTABA!
  { path: 'registrar-usuario/:id', component: RegistrarUsuarioComponent },

  // (Opcional) Ruta comodín: Si escriben cualquier cosa rara, van al home
  { path:'**', component:HomeComponent}
];
