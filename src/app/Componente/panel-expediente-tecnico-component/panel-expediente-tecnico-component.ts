import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {ExpedienteTecnicoService} from '../../services/expedienteTecnico-service';
import {ExpedienteTecnico} from '../../model/expedienteTecnico';

@Component({
  selector: 'app-panel-expediente-tecnico-component',
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-expediente-tecnico-component.html',
  styleUrl: './panel-expediente-tecnico-component.css',
})
export class PanelExpedienteTecnicoComponent implements OnInit {
  // Inyección del servicio
  private expedienteService = inject(ExpedienteTecnicoService);
  rolActualUsuario: string | null = null;
  // Estados
  expedientes = signal<ExpedienteTecnico[]>([]);

  showForm = signal(false);
  editingId = signal<number | null>(null);
  expedienteForm: ExpedienteTecnico = new ExpedienteTecnico();

  searchId = signal<number | null>(null);
  detailOpen = signal(false);
  detalleSeleccionado = signal<ExpedienteTecnico | null>(null);

  // Filtro
  expedientesFiltrados = computed(() => {
    const search = this.searchId();
    const list = this.expedientes();
    if (!search) return list;
    return list.filter(e => e.id === search);
  });

  ngOnInit(): void {
    this.rolActualUsuario = localStorage.getItem('rol');
    // 1. Cargar lista inicial
    this.expedienteService.list().subscribe(data => this.expedientes.set(data));

    // 2. Suscribirse a cambios (Lógica del Profesor)
    this.expedienteService.getListaCambio().subscribe(data => this.expedientes.set(data));
  }

  esAdminODev(): boolean{
    return this.rolActualUsuario === 'ROLE_ADMIN'|| this.rolActualUsuario === 'ROLE_DESARROLLADOR';
  }

  // --- CRUD ---

  onRegistrarClick(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.expedienteForm = new ExpedienteTecnico();
    // Opcional: pre-cargar fecha de hoy
    this.expedienteForm.fechaCarga = new Date().toISOString().slice(0, 10);
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  guardar(): void {
    if (!this.expedienteForm.documentoUR || !this.expedienteForm.fechaCarga) {
      alert('Complete la URL del documento y la fecha.');
      return;
    }

    if (this.editingId() === null) {
      // CREAR
      this.expedienteService.insert(this.expedienteForm).subscribe(() => {
        this.expedienteService.actualizarLista();
        this.showForm.set(false);
        alert('Expediente registrado correctamente');
      });
    } else {
      // EDITAR (Pasamos objeto e ID)
      this.expedienteService.update(this.expedienteForm, this.expedienteForm.id).subscribe(() => {
        this.expedienteService.actualizarLista();
        this.showForm.set(false);
        alert('Expediente actualizado');
      });
    }
  }

  editar(e: ExpedienteTecnico): void {
    this.showForm.set(true);
    this.editingId.set(e.id);
    this.expedienteForm = { ...e }; // Clonar para no editar tabla directo
  }

  eliminar(e: ExpedienteTecnico): void {
    if (confirm(`¿Eliminar expediente #${e.id}?`)) {
      this.expedienteService.delete(e.id).subscribe(() => {
        this.expedienteService.actualizarLista();
      });
    }
  }

  // --- BÚSQUEDA ---

  buscarPorId(): void {
    const id = this.searchId();
    if (id) {
      this.expedienteService.listId(id).subscribe({
        next: (e) => this.expedientes.set([e]),
        error: () => alert('Expediente no encontrado')
      });
    } else {
      this.expedienteService.actualizarLista();
    }
  }

  limpiarBusqueda(): void {
    this.searchId.set(null);
    this.expedienteService.actualizarLista();
  }

  // --- DETALLES ---
  verDetalle(e: ExpedienteTecnico) { this.detalleSeleccionado.set(e); this.detailOpen.set(true); }
  cerrarDetalle() { this.detailOpen.set(false); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.detailOpen()) this.cerrarDetalle(); }
}
