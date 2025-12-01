import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';

import {RouterLink} from '@angular/router';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EvidenciaService} from '../../services/evidencia-service';
import {DenunciaService} from '../../services/denuncia-service';
import {Evidencia} from '../../model/evidencia';
import {Denuncia} from '../../model/denuncia';

@Component({
  selector: 'app-panel-evidencia',
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-evidencia-component.html',
  styleUrls: ['./panel-evidencia-component.css']
})
export class PanelEvidenciaComponent implements OnInit {
  // Inyecciones
  private evidenciaService = inject(EvidenciaService);
  private denunciaService = inject(DenunciaService);

  // Datos
  evidencias = signal<Evidencia[]>([]);
  denunciasDisponibles = signal<Denuncia[]>([]); // Para el select

  // Formulario
  showForm = signal(false);
  editingId = signal<number | null>(null);
  evidenciaForm: Evidencia = new Evidencia();

  // Selección temporal
  selectedDenuncia: Denuncia | null = null;

  // UI
  searchId = signal<number | null>(null);
  detailOpen = signal(false);
  detalleSeleccionado = signal<Evidencia | null>(null);

  // Filtro
  evidenciasFiltradas = computed(() => {
    const search = this.searchId();
    const list = this.evidencias();
    if (!search) return list;
    return list.filter(e => e.id === search);
  });

  ngOnInit(): void {
    // 1. Cargar Evidencias
    this.evidenciaService.list().subscribe(data => this.evidencias.set(data));
    this.evidenciaService.getListaCambio().subscribe(data => this.evidencias.set(data));

    // 2. Cargar Denuncias (para asignar)
    this.denunciaService.list().subscribe(data => this.denunciasDisponibles.set(data));
  }

  // --- CRUD ---

  onRegistrarClick(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.evidenciaForm = new Evidencia();
    this.selectedDenuncia = null;
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  guardar(): void {
    if (!this.evidenciaForm.tipo || !this.evidenciaForm.urlArchivo || !this.selectedDenuncia) {
      alert('Complete Tipo, URL y seleccione una Denuncia.');
      return;
    }

    // Asignar relación
    this.evidenciaForm.denuncia = this.selectedDenuncia;

    if (this.editingId() === null) {
      // CREAR
      this.evidenciaService.insert(this.evidenciaForm).subscribe(() => {
        this.evidenciaService.actualizarLista();
        this.showForm.set(false);
        alert('Evidencia registrada');
      });
    } else {
      // EDITAR
      this.evidenciaService.update(this.evidenciaForm, this.evidenciaForm.id).subscribe(() => {
        this.evidenciaService.actualizarLista();
        this.showForm.set(false);
        alert('Evidencia actualizada');
      });
    }
  }

  editar(e: Evidencia): void {
    this.showForm.set(true);
    this.editingId.set(e.id);
    this.evidenciaForm = { ...e }; // Clonar

    // Pre-seleccionar denuncia
    if (e.denuncia) {
      this.selectedDenuncia = this.denunciasDisponibles().find(d => d.idDenuncia === e.denuncia.idDenuncia) || null;
    }
  }

  eliminar(e: Evidencia): void {
    if (confirm(`¿Eliminar evidencia #${e.id}?`)) {
      this.evidenciaService.delete(e.id).subscribe(() => {
        this.evidenciaService.actualizarLista();
      });
    }
  }

  // --- BÚSQUEDA ---
  buscarPorId(): void {
    const id = this.searchId();
    if (id) {
      this.evidenciaService.listId(id).subscribe({
        next: (e) => this.evidencias.set([e]),
        error: () => alert('Evidencia no encontrada')
      });
    } else {
      this.evidenciaService.actualizarLista();
    }
  }

  limpiarBusqueda(): void {
    this.searchId.set(null);
    this.evidenciaService.actualizarLista();
  }

  // --- HELPERS ---
  tipoClass(tipo?: string): string {
    const t = (tipo || '').toLowerCase();
    if (t.includes('foto')) return 'tipo-foto';
    if (t.includes('video')) return 'tipo-video';
    return 'tipo-doc';
  }

  verDetalle(e: Evidencia) { this.detalleSeleccionado.set(e); this.detailOpen.set(true); }
  cerrarDetalle() { this.detailOpen.set(false); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.detailOpen()) this.cerrarDetalle(); }
}
