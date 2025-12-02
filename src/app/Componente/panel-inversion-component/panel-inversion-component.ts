import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {InversionService} from '../../services/inversion-service';
import {ObraPublicaService} from '../../services/obraPublica-service';
import {Inversion} from '../../model/inversion';
import {ObraPublica} from '../../model/obraPublica';

@Component({
  selector: 'app-panel-inversion-component',
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-inversion-component.html',
  styleUrl: './panel-inversion-component.css',
})
export class PanelInversionComponent implements OnInit {
  // Inyecciones
  private inversionService = inject(InversionService);
  private obraService = inject(ObraPublicaService);
  rolActualUsuario: string | null = null;
  // Datos
  inversiones = signal<Inversion[]>([]);
  obrasDisponibles = signal<ObraPublica[]>([]);

  // Formulario
  showForm = signal(false);
  editingId = signal<number | null>(null);
  inversionForm: Inversion = new Inversion();

  // Selección temporal
  selectedObra: ObraPublica | null = null;

  // UI
  searchId = signal<number | null>(null);
  detailOpen = signal(false);
  detalleSeleccionado = signal<Inversion | null>(null);

  // Filtro (usando idInversion)
  inversionesFiltradas = computed(() => {
    const search = this.searchId();
    const list = this.inversiones();
    if (!search) return list;
    return list.filter(i => i.idInversion === search);
  });

  ngOnInit(): void {
    this.rolActualUsuario = localStorage.getItem('rol');
    // 1. Cargar Inversiones
    this.inversionService.list().subscribe(data => this.inversiones.set(data));
    this.inversionService.getListaCambio().subscribe(data => this.inversiones.set(data));

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
    this.inversionForm = new Inversion();
    this.selectedObra = null;
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  guardar(): void {
    if (!this.inversionForm.montoTotal || !this.inversionForm.fechaAprobacion || !this.selectedObra) {
      alert('Complete Monto, Fecha y seleccione una Obra.');
      return;
    }

    // Asignar relación (OJO: en tu modelo se llama 'obrapublica' en minúscula)
    this.inversionForm.obrapublica = this.selectedObra;

    if (this.editingId() === null) {
      // CREAR
      this.inversionService.insert(this.inversionForm).subscribe(() => {
        this.inversionService.actualizarLista();
        this.showForm.set(false);
        alert('Inversión registrada');
      });
    } else {
      // EDITAR
      this.inversionService.update(this.inversionForm, this.inversionForm.idInversion).subscribe(() => {
        this.inversionService.actualizarLista();
        this.showForm.set(false);
        alert('Inversión actualizada');
      });
    }
  }

  editar(i: Inversion): void {
    this.showForm.set(true);
    this.editingId.set(i.idInversion);
    this.inversionForm = { ...i }; // Clonar

    // Pre-seleccionar Obra
    if (i.obrapublica) {
      this.selectedObra = this.obrasDisponibles().find(o => o.idObra === i.obrapublica.idObra) || null;
    }
  }

  eliminar(i: Inversion): void {
    if (confirm(`¿Eliminar inversión #${i.idInversion}?`)) {
      this.inversionService.delete(i.idInversion).subscribe(() => {
        this.inversionService.actualizarLista();
      });
    }
  }

  // --- BÚSQUEDA ---
  buscarPorId(): void {
    const id = this.searchId();
    if (id) {
      this.inversionService.listId(id).subscribe({
        next: (i) => this.inversiones.set([i]),
        error: () => alert('Inversión no encontrada')
      });
    } else {
      this.inversionService.actualizarLista();
    }
  }

  limpiarBusqueda(): void {
    this.searchId.set(null);
    this.inversionService.actualizarLista();
  }

  // --- DETALLES ---
  verDetalle(i: Inversion) { this.detalleSeleccionado.set(i); this.detailOpen.set(true); }
  cerrarDetalle() { this.detailOpen.set(false); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.detailOpen()) this.cerrarDetalle(); }
}
