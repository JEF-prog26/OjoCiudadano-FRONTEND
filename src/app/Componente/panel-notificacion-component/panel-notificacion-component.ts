import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {NotificacionService} from '../../services/notificacion-service';
import {UserService} from '../../services/user-service';
import {Notificacion} from '../../model/notificacion';
import {User} from '../../model/user';

@Component({
  selector: 'app-panel-notificacion-component',
  imports: [
    CommonModule, FormsModule, HeaderPanelComponent
],
  templateUrl: './panel-notificacion-component.html',
  styleUrls: ['./panel-notificacion-component.css']
})
export class PanelNotificacionComponent implements OnInit { // <-- CLAVE: Componente exportable
  // Inyecciones
  private notifService = inject(NotificacionService);
  private userService = inject(UserService);

  // Estados
  notificaciones = signal<Notificacion[]>([]);
  usuariosDisponibles = signal<User[]>([]); // Para el <select> del formulario

  showForm = signal(false);
  editingId = signal<number | null>(null);
  notificacionForm: Notificacion = new Notificacion();

  // Usuario seleccionado temporalmente en el form
  selectedUser: User | null = null;

  searchId = signal<number | null>(null);
  detailOpen = signal(false);
  detalleSeleccionado = signal<Notificacion | null>(null);

  // Filtro
  notificacionesFiltradas = computed(() => {
    const search = this.searchId();
    const list = this.notificaciones();
    if (!search) return list;
    return list.filter(n => n.id === search);
  });

  ngOnInit(): void {
    // 1. Cargar notificaciones
    this.notifService.list().subscribe(data => this.notificaciones.set(data));
    this.notifService.getListaCambio().subscribe(data => this.notificaciones.set(data));

    // 2. Cargar usuarios (para poder seleccionarlos en el formulario)
    this.userService.list().subscribe(data => this.usuariosDisponibles.set(data));
  }

  // --- GESTIÓN CRUD ---

  onRegistrarClick(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.notificacionForm = new Notificacion();
    this.selectedUser = null;
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  guardar(): void {
    if (!this.notificacionForm.mensaje || !this.notificacionForm.fechaEnvio || !this.selectedUser) {
      alert('Complete mensaje, fecha y seleccione un usuario.');
      return;
    }

    // Asignar el usuario seleccionado al objeto notificación
    this.notificacionForm.usuario = this.selectedUser;

    if (this.editingId() === null) {
      // CREAR
      this.notifService.insert(this.notificacionForm).subscribe(() => {
        this.notifService.actualizarLista();
        this.showForm.set(false);
        alert('Notificación enviada correctamente');
      });
    } else {
      // EDITAR
      this.notifService.update(this.notificacionForm, this.notificacionForm.id).subscribe(() => {
        this.notifService.actualizarLista();
        this.showForm.set(false);
        alert('Notificación actualizada');
      });
    }
  }

  editar(n: Notificacion): void {
    this.showForm.set(true);
    this.editingId.set(n.id);
    this.notificacionForm = { ...n }; // Clonar

    // Pre-seleccionar el usuario en el combo
    // Buscamos en la lista de usuarios disponibles el que coincida con el ID del usuario de la notificacion
    if (n.usuario) {
      this.selectedUser = this.usuariosDisponibles().find(u => u.id === n.usuario.id) || null;
    }
  }

  eliminar(n: Notificacion): void {
    if (confirm(`¿Eliminar notificación #${n.id}?`)) {
      this.notifService.delete(n.id).subscribe(() => {
        this.notifService.actualizarLista();
      });
    }
  }

  // --- BÚSQUEDA Y DETALLES ---

  buscarPorId(): void {
    const id = this.searchId();
    if (id) {
      this.notifService.listId(id).subscribe({
        next: (n) => this.notificaciones.set([n]),
        error: () => alert('Notificación no encontrada')
      });
    } else {
      this.notifService.actualizarLista();
    }
  }

  limpiarBusqueda(): void {
    this.searchId.set(null);
    this.notifService.actualizarLista();
  }

  verDetalle(n: Notificacion) { this.detalleSeleccionado.set(n); this.detailOpen.set(true); }
  cerrarDetalle() { this.detailOpen.set(false); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.detailOpen()) this.cerrarDetalle(); }
}


