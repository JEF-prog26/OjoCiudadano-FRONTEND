import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {GobiernoRegionalService} from '../../services/gobiernoRegional-service';
import {GobiernoRegional} from '../../model/gobiernoRegional';

@Component({
  selector: 'app-panel-gobierno-regional-component',
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-gobierno-regional-component.html',
  styleUrl: './panel-gobierno-regional-component.css',
})
export class PanelGobiernoRegionalComponent implements OnInit{
  // Inyección del servicio
  private gobiernoService = inject(GobiernoRegionalService);

  // Estados reactivos (Signals)
  gobiernos = signal<GobiernoRegional[]>([]);

  showForm = signal(false);
  editingId = signal<number | null>(null);
  gobiernoForm: GobiernoRegional = new GobiernoRegional();

  searchId = signal<number | null>(null);
  detailOpen = signal(false);
  detalleSeleccionado = signal<GobiernoRegional | null>(null);

  // Filtro computado
  gobiernosFiltrados = computed(() => {
    const search = this.searchId();
    const list = this.gobiernos();
    if (!search) return list;
    return list.filter(g => g.id === search);
  });

  ngOnInit(): void {
    // 1. Cargar lista inicial
    this.gobiernoService.list().subscribe(data => this.gobiernos.set(data));

    // 2. Suscribirse a cambios reactivos
    this.gobiernoService.getListaCambio().subscribe(data => this.gobiernos.set(data));
  }

  // --- CRUD ---

  onRegistrarClick(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.gobiernoForm = new GobiernoRegional();
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  guardar(): void {
    // Validaciones simples
    if (!this.gobiernoForm.nombre || !this.gobiernoForm.ubicacion || !this.gobiernoForm.contacto) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    if (this.editingId() === null) {
      // CREAR (POST)
      this.gobiernoService.insert(this.gobiernoForm).subscribe(() => {
        this.gobiernoService.actualizarLista();
        this.showForm.set(false);
        alert('Gobierno Regional registrado correctamente');
      });
    } else {
      // EDITAR (PUT) - Pasamos objeto e ID
      this.gobiernoService.update(this.gobiernoForm, this.gobiernoForm.id).subscribe(() => {
        this.gobiernoService.actualizarLista();
        this.showForm.set(false);
        alert('Gobierno Regional actualizado');
      });
    }
  }

  editar(g: GobiernoRegional): void {
    this.showForm.set(true);
    this.editingId.set(g.id);
    this.gobiernoForm = { ...g }; // Clonar objeto
  }

  eliminar(g: GobiernoRegional): void {
    if (confirm(`¿Eliminar a ${g.nombre}?`)) {
      this.gobiernoService.delete(g.id).subscribe(() => {
        this.gobiernoService.actualizarLista();
      });
    }
  }

  // --- BÚSQUEDA ---

  buscarPorId(): void {
    const id = this.searchId();
    if (id) {
      this.gobiernoService.listId(id).subscribe({
        next: (g) => this.gobiernos.set([g]),
        error: () => alert('Gobierno Regional no encontrado')
      });
    } else {
      this.gobiernoService.actualizarLista();
    }
  }

  limpiarBusqueda(): void {
    this.searchId.set(null);
    this.gobiernoService.actualizarLista();
  }

  // --- DETALLES (MODAL) ---
  verDetalle(g: GobiernoRegional) { this.detalleSeleccionado.set(g); this.detailOpen.set(true); }
  cerrarDetalle() { this.detailOpen.set(false); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.detailOpen()) this.cerrarDetalle(); }
}
