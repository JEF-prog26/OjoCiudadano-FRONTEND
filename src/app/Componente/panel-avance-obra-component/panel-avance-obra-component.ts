import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {AvanceObraService} from '../../services/avanceObras-service';
import {ObraPublicaService} from '../../services/obraPublica-service';
import {AvanceObra} from '../../model/avanceObra';
import {ObraPublica} from '../../model/obraPublica';

@Component({
  selector: 'app-panel-avance-obra-component',
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-avance-obra-component.html',
  styleUrl: './panel-avance-obra-component.css',
})
export class PanelAvanceObraComponent implements OnInit {
  // Inyecciones
  private avanceService = inject(AvanceObraService);
  private obraService = inject(ObraPublicaService);
  rolActualUsuario: string | null = null;
  // Datos
  avances = signal<AvanceObra[]>([]);
  obrasDisponibles = signal<ObraPublica[]>([]);

  // Formulario
  showForm = signal(false);
  editingId = signal<number | null>(null);
  avanceForm: AvanceObra = new AvanceObra();

  // Selección temporal
  selectedObra: ObraPublica | null = null;

  // UI
  searchId = signal<number | null>(null);
  detailOpen = signal(false);
  detalleSeleccionado = signal<AvanceObra | null>(null);

  // Filtro
  avancesFiltrados = computed(() => {
    const search = this.searchId();
    const list = this.avances();
    if (!search) return list;
    return list.filter(a => a.idAvanceObra === search);
  });

  ngOnInit(): void {
    this.rolActualUsuario = localStorage.getItem('rol');
    // 1. Cargar Avances
    this.avanceService.list().subscribe(data => this.avances.set(data));
    this.avanceService.getListaCambio().subscribe(data => this.avances.set(data));

    // 2. Cargar Obras (para el select)
    this.obraService.list().subscribe(data => this.obrasDisponibles.set(data));
  }

  esAdminODev(): boolean{
    return this.rolActualUsuario === 'ROLE_ADMIN'|| this.rolActualUsuario === 'ROLE_DESARROLLADOR';
  }

  // --- CRUD ---

  onRegistrarClick(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.avanceForm = new AvanceObra();
    this.selectedObra = null;
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  guardar(): void {
    if (!this.avanceForm.porcentajeDeAvance || !this.avanceForm.fechaReporte || !this.selectedObra) {
      alert('Porcentaje, Fecha y Obra son obligatorios.');
      return;
    }

    // Asignar relación (nombre exacto del modelo: 'obrapublica')
    this.avanceForm.obrapublica = this.selectedObra;

    if (this.editingId() === null) {
      // CREAR
      this.avanceService.insert(this.avanceForm).subscribe(() => {
        this.avanceService.actualizarLista();
        this.showForm.set(false);
        alert('Avance registrado correctamente');
      });
    } else {
      // EDITAR
      this.avanceService.update(this.avanceForm, this.avanceForm.idAvanceObra).subscribe(() => {
        this.avanceService.actualizarLista();
        this.showForm.set(false);
        alert('Avance actualizado');
      });
    }
  }

  editar(a: AvanceObra): void {
    this.showForm.set(true);
    this.editingId.set(a.idAvanceObra);
    this.avanceForm = { ...a }; // Clonar

    // Pre-seleccionar Obra
    if (a.obrapublica) {
      this.selectedObra = this.obrasDisponibles().find(o => o.idObra === a.obrapublica.idObra) || null;
    }
  }

  eliminar(a: AvanceObra): void {
    if (confirm(`¿Eliminar el avance #${a.idAvanceObra}?`)) {
      this.avanceService.delete(a.idAvanceObra).subscribe(() => {
        this.avanceService.actualizarLista();
      });
    }
  }

  // --- BÚSQUEDA ---
  buscarPorId(): void {
    const id = this.searchId();
    if (id) {
      this.avanceService.listId(id).subscribe({
        next: (a) => this.avances.set([a]),
        error: () => alert('Avance no encontrado')
      });
    } else {
      this.avanceService.actualizarLista();
    }
  }

  limpiarBusqueda(): void {
    this.searchId.set(null);
    this.avanceService.actualizarLista();
  }

  // --- DETALLES ---
  verDetalle(a: AvanceObra) { this.detalleSeleccionado.set(a); this.detailOpen.set(true); }
  cerrarDetalle() { this.detailOpen.set(false); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.detailOpen()) this.cerrarDetalle(); }
}
