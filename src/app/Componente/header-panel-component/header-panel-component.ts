import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-header-panel-component',
  imports: [CommonModule,
    RouterLink,
    RouterLinkActive, // Para el estilo de link activo
    MatToolbarModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './header-panel-component.html',
  styleUrl: './header-panel-component.css',
})
export class HeaderPanelComponent implements OnInit {

  private router = inject(Router);
  rolActual: string | null = null;

  ngOnInit() {
    // Capturamos el rol apenas carga el componente
    this.rolActual = localStorage.getItem('rol');
  }

  // --- LÓGICA DE VALIDACIÓN ---

  // Valida si el usuario tiene UNO de los roles permitidos
  tieneRol(rolesPermitidos: string[]): boolean {
    if (!this.rolActual) return false;
    return rolesPermitidos.includes(this.rolActual);
  }

  // Helpers específicos (Opcionales, pero hacen el HTML más limpio)
  get esAdminODev(): boolean {
    return this.tieneRol(['ROLE_ADMIN', 'ROLE_DESARROLLADOR']);
  }

  get esCiudadano(): boolean {
    return this.tieneRol(['ROLE_CIUDADANO']);
  }

  // --- LOGOUT ---
  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
