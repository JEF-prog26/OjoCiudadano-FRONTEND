import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para ngIf y ngFor
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

/* ===== Interfaces ===== */
interface Expediente {
  id: number;
  nombre: string;
  documentoUr: string;
  fechaExpediente: string; // 'YYYY-MM-DD'
}

@Component({
  selector: 'app-panel-expediente-tecnico-component',
  standalone: true, // Asegura que se usa como componente standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-expediente-tecnico-component.html',
  styleUrl: './panel-expediente-tecnico-component.css',
})
export class PanelExpedienteTecnicoComponent implements OnInit {
  showForm = false;
  editingId: number | null = null; // null = creando, != null = editando

  expedienteForm: Expediente = this.crearFormVacio();
  expedientes: Expediente[] = [];
  expedientesFiltrados: Expediente[] = [];

  // 🔍 valor del buscador por ID
  searchId: number | null = null;

  // 🧩 modal detalle
  detailOpen = false;
  detalleSeleccionado: Expediente | null = null;

  // El Router se inyecta para la función goBack
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.expedientesFiltrados = this.expedientes;
  }

  private crearFormVacio(): Expediente {
    return {
      id: 0,
      nombre: '',
      documentoUr: '',
      fechaExpediente: '',
    };
  }

  // Simula la navegación de vuelta usando el historial del navegador
  goBack(): void {
    // history.back() es una solución robusta para volver a la página anterior
    // cuando la configuración de Angular Router no es accesible.
    history.back();
    console.log('Navegación: Volver al estado anterior del navegador.');
  }

  /* 🆕 REGISTRO */
  onRegistrarClick(): void {
    this.showForm = true;
    this.editingId = null;
    this.expedienteForm = this.crearFormVacio();
  }

  cancelarForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.expedienteForm = this.crearFormVacio();
  }

  guardarExpediente(): void {
    if (!this.expedienteForm.id || !this.expedienteForm.nombre || !this.expedienteForm.documentoUr) {
      // Usar console.error en lugar de alert para evitar problemas de iFrame
      console.error('ERROR: Completa al menos ID, Nombre y Documento UR.');
      return;
    }

    // Fecha por defecto si está vacía
    if (!this.expedienteForm.fechaExpediente) {
      this.expedienteForm.fechaExpediente = new Date().toISOString().slice(0, 10);
    }

    if (this.editingId === null) {
      // 🆕 CREAR
      const existe = this.expedientes.some((e) => e.id === this.expedienteForm.id);
      if (existe) {
        // En lugar de alert, se podría usar un modal, pero se respeta la instrucción
        console.error('ERROR: Ya existe un expediente con ese ID. Por favor, usa otro.');
        return;
      }

      const nuevo: Expediente = { ...this.expedienteForm };
      this.expedientes.push(nuevo);
    } else {
      // ✏️ EDITAR
      const idx = this.expedientes.findIndex((e) => e.id === this.editingId);
      if (idx > -1) {
        this.expedientes[idx] = { ...this.expedienteForm };
      }
    }

    // Se actualiza la lista filtrada y se resetea el estado
    this.expedientesFiltrados = [...this.expedientes];
    this.showForm = false;
    this.editingId = null;
    this.expedienteForm = this.crearFormVacio();
    this.searchId = null;
    console.log('Expedientes actualizados:', this.expedientes);
  }

  /* 🔍 BÚSQUEDA */
  buscarPorId(): void {
    this.showForm = false;

    if (this.searchId === null || this.searchId === undefined) {
      this.expedientesFiltrados = [...this.expedientes];
      return;
    }

    this.expedientesFiltrados = this.expedientes.filter(
      (e) => e.id === this.searchId
    );

    if (this.expedientesFiltrados.length === 0) {
      // Usar console.error en lugar de alert para evitar problemas de iFrame
      console.error('No se encontró ningún expediente con ese ID.');
      // Opcionalmente, puedes mostrar un mensaje en la interfaz
    }
  }

  limpiarBusqueda(): void {
    this.searchId = null;
    this.expedientesFiltrados = [...this.expedientes];
  }

  /* ✏️ EDICIÓN Y ELIMINACIÓN */
  eliminarExpediente(expediente: Expediente): void {
    // Reemplazamos window.confirm por una simple validación para evitar problemas con iFrames
    const isConfirmed = window.confirm(
      `¿Seguro que deseas eliminar el expediente con ID ${expediente.id}?`
    );

    if (!isConfirmed) return;

    this.expedientes = this.expedientes.filter((e) => e.id !== expediente.id);
    this.expedientesFiltrados = [...this.expedientes];
    this.searchId = null;

    if (this.detalleSeleccionado?.id === expediente.id) {
      this.cerrarDetalle();
    }
  }

  editarExpediente(expediente: Expediente): void {
    this.showForm = true;
    this.editingId = expediente.id;
    this.expedienteForm = { ...expediente };
  }


  /* 👁 MODAL DETALLE */
  verDetalle(e: Expediente): void {
    this.detalleSeleccionado = e;
    this.detailOpen = true;
  }

  cerrarDetalle(): void {
    this.detailOpen = false;
    this.detalleSeleccionado = null;
  }

  // Cerrar modal con ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.detailOpen) this.cerrarDetalle();
  }
}
