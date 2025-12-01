import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para ngIf y ngFor
import { FormsModule } from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {ObraPublicaService} from '../../services/obraPublica-service';
import {GobiernoRegionalService} from '../../services/gobiernoRegional-service';
import {ExpedienteTecnicoService} from '../../services/expedienteTecnico-service';
import {ObraPublica} from '../../model/obraPublica';
import {GobiernoRegional} from '../../model/gobiernoRegional';
import {ExpedienteTecnico} from '../../model/expedienteTecnico'; // Necesario para ngModel

@Component({
  selector: 'app-panel-obra-publica-component',
  standalone: true, // Asegura que se usa como componente standalone
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-obra-publica-component.html',
  styleUrl: './panel-obra-publica-component.css',
})
export class PanelObraPublicaComponent implements OnInit {
  // Inyecciones
  private obraService = inject(ObraPublicaService);
  private gobiernoService = inject(GobiernoRegionalService);
  private expedienteService = inject(ExpedienteTecnicoService);

  // Datos Principales
  obras = signal<ObraPublica[]>([]);
  gobiernosDisponibles = signal<GobiernoRegional[]>([]);
  expedientesDisponibles = signal<ExpedienteTecnico[]>([]);

  // Estado Formulario
  showForm = signal(false);
  editingId = signal<number | null>(null);
  obraForm: ObraPublica = new ObraPublica();

  // Selecciones temporales para el formulario
  selectedGobierno: GobiernoRegional | null = null;
  selectedExpediente: ExpedienteTecnico | null = null;

  // UI States
  searchId = signal<number | null>(null);
  detailOpen = signal(false);
  detalleSeleccionado = signal<ObraPublica | null>(null);

  // Filtro (usando idObra)
  obrasFiltradas = computed(() => {
    const search = this.searchId();
    const list = this.obras();
    if (!search) return list;
    return list.filter(o => o.idObra === search);
  });

  ngOnInit(): void {
    // 1. Cargar Obras
    this.obraService.list().subscribe(data => this.obras.set(data));
    this.obraService.getListaCambio().subscribe(data => this.obras.set(data));

    // 2. Cargar listas para los dropdowns
    this.gobiernoService.list().subscribe(data => this.gobiernosDisponibles.set(data));
    this.expedienteService.list().subscribe(data => this.expedientesDisponibles.set(data));
  }

  // --- CRUD ---

  onRegistrarClick(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.obraForm = new ObraPublica();
    this.selectedGobierno = null;
    this.selectedExpediente = null;
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  guardar(): void {
    if (!this.obraForm.nombreObra || !this.obraForm.fechaInicio || !this.selectedGobierno) {
      alert('Nombre, Fecha Inicio y Gobierno Regional son obligatorios.');
      return;
    }

    // Asignar relaciones
    this.obraForm.gobiernoRegional = this.selectedGobierno;
    if (this.selectedExpediente) {
      this.obraForm.expedienteTecnico = this.selectedExpediente;
    }

    if (this.editingId() === null) {
      // CREAR
      this.obraService.insert(this.obraForm).subscribe(() => {
        this.obraService.actualizarLista();
        this.showForm.set(false);
        alert('Obra registrada correctamente');
      });
    } else {
      // EDITAR (Usando idObra)
      this.obraService.update(this.obraForm, this.obraForm.idObra).subscribe(() => {
        this.obraService.actualizarLista();
        this.showForm.set(false);
        alert('Obra actualizada');
      });
    }
  }

  editar(o: ObraPublica): void {
    this.showForm.set(true);
    this.editingId.set(o.idObra);
    this.obraForm = { ...o }; // Clonar

    // Pre-seleccionar dropdowns
    if (o.gobiernoRegional) {
      this.selectedGobierno = this.gobiernosDisponibles().find(g => g.id === o.gobiernoRegional.id) || null;
    }
    if (o.expedienteTecnico) {
      this.selectedExpediente = this.expedientesDisponibles().find(e => e.id === o.expedienteTecnico.id) || null;
    }
  }

  eliminar(o: ObraPublica): void {
    if (confirm(`¿Eliminar la obra "${o.nombreObra}"?`)) {
      this.obraService.delete(o.idObra).subscribe(() => {
        this.obraService.actualizarLista();
      });
    }
  }

  // --- BÚSQUEDA ---
  buscarPorId(): void {
    const id = this.searchId();
    if (id) {
      this.obraService.listId(id).subscribe({
        next: (o) => this.obras.set([o]),
        error: () => alert('Obra no encontrada')
      });
    } else {
      this.obraService.actualizarLista();
    }
  }

  limpiarBusqueda(): void {
    this.searchId.set(null);
    this.obraService.actualizarLista();
  }

  // --- HELPERS ---
  estadoClass(estado?: string): string {
    const e = (estado || '').toLowerCase();
    if (e.includes('ejecución')) return 'estado-azul';
    if (e.includes('finalizada')) return 'estado-verde';
    if (e.includes('paralizada')) return 'estado-rojo';
    return 'estado-gris';
  }

  verDetalle(o: ObraPublica) { this.detalleSeleccionado.set(o); this.detailOpen.set(true); }
  cerrarDetalle() { this.detailOpen.set(false); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.detailOpen()) this.cerrarDetalle(); }
}
