import {Component, HostListener, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../header-component/header-component';

@Component({
  selector: 'app-sobre-nosotros-component',
  imports: [
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './sobre-nosotros-component.html',
  styleUrl: './sobre-nosotros-component.css',
})
export class SobreNosotrosComponent {
  // Estado para el menú hamburguesa (móvil)
  isMenuOpen = signal(false);

  // Estado para el submenú "Conócenos" (usado en modo móvil)
  isConocenosOpen = signal(false);

  // Usado para mantener la lógica de cierre del menú "Conócenos" si se abre el menú principal en móvil
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Si la pantalla es lo suficientemente grande, forzamos el cierre del menú móvil y el submenú
    if (window.innerWidth > 768) {
      this.isMenuOpen.set(false);
      this.isConocenosOpen.set(false);
    }
  }

  ngOnInit() {
    // Inicialización si fuera necesario
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
    // Si el menú principal se cierra, aseguramos que el submenú también se oculte
    if (!this.isMenuOpen()) {
      this.isConocenosOpen.set(false);
    }
  }

  // Alterna el submenú "Conócenos" solo si estamos en modo móvil o si la lista está abierta
  toggleConocenos() {
    // El comportamiento en desktop sigue siendo manejado por el CSS :hover.
    // En móvil, si la pantalla es <= 768px (o cuando el menú está visible)
    // se activa el toggle con click.
    if (window.innerWidth <= 768) {
      this.isConocenosOpen.update(value => !value);
    }
  }
}
