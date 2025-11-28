import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-header-component',
    imports: [
      MatMenuModule,
      CommonModule,
      RouterLink,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule
    ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  router: Router = inject(Router);
  rol: string | null = null;

  // Metodo auxiliar para saber si hay alguien logueado
  estaLogueado(): boolean {
    return localStorage.getItem('rol') !== null;
  }

  cerrarSesion() {
    localStorage.clear(); // O localStorage.removeItem('token') y 'rol'
    this.router.navigate(['/login']);
  }
}
