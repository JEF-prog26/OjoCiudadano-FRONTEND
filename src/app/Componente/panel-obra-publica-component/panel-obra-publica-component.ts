import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para ngIf y ngFor
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

/* ===== Interfaces ===== */
interface ObraPublica {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string; // 'YYYY-MM-DD'
  fechaFin: string; // 'YYYY-MM-DD'
  estado: 'Pendiente' | 'En Ejecución' | 'Finalizada' | 'Cancelada';
  idGobierno: number; // Referencia al Gobierno Regional
  idExpediente: number; // Referencia al Expediente Técnico
}

@Component({
  selector: 'app-panel-obra-publica-component',
  standalone: true, // Asegura que se usa como componente standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-obra-publica-component.html',
  styleUrl: './panel-obra-publica-component.css',
})
export class PanelObraPublicaComponent implements OnInit {
  showForm = false;
  editingId: number | null = null; // null = creando, != null = editando

  obraForm: ObraPublica = this.crearFormVacio();
  obras: ObraPublica[] = [];
  obrasFiltradas: ObraPublica[] = [];

  // 🔍 valor del buscador por ID
  searchId: number | null = null;

  // 🧩 modal detalle
  detailOpen = false;
  detalleSeleccionado: ObraPublica | null = null;

  // Lista de estados disponibles para el formulario
  estadosDisponibles: ObraPublica['estado'][] = [
    'Pendiente',
    'En Ejecución',
    'Finalizada',
    'Cancelada',
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Datos de ejemplo
    this.obras = [
      {
        id: 1001,
        nombre: 'Rehabilitación Vial Av. Sol',
        descripcion: 'Mejora de la infraestructura vial de la avenida principal.',
        fechaInicio: '2025-06-01',
        fechaFin: '2026-01-30',
        estado: 'En Ejecución',
        idGobierno: 25,
        idExpediente: 102,
      },
      {
        id: 1002,
        nombre: 'Construcción Hospital Nivel III',
        descripcion: 'Nueva infraestructura hospitalaria para la región sur.',
        fechaInicio: '2024-03-15',
        fechaFin: '2025-08-30',
        estado: 'Pendiente',
        idGobierno: 10,
        idExpediente: 101,
      },
      {
        id: 1003,
        nombre: 'Saneamiento Básico Rural',
        descripcion: 'Instalación de agua potable y desagüe en 10 comunidades rurales.',
        fechaInicio: '2023-11-20',
        fechaFin: '2024-10-10',
        estado: 'Finalizada',
        idGobierno: 40,
        idExpediente: 104,
      },
    ];
    this.obrasFiltradas = [...this.obras];
  }

  private crearFormVacio(): ObraPublica {
    return {
      id: 0,
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      estado: 'Pendiente',
      idGobierno: 0,
      idExpediente: 0,
    };
  }

  // Permite volver a la página anterior (funcionalidad consistente)
  goBack(): void {
    history.back();
    console.log('Navegación: Volver al estado anterior del navegador.');
  }

  /* 🆕 REGISTRO */
  onRegistrarClick(): void {
    this.showForm = true;
    this.editingId = null;
    this.obraForm = this.crearFormVacio();
  }

  cancelarForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.obraForm = this.crearFormVacio();
  }

  guardarObra(): void {
    if (!this.validarCampos()) {
      return;
    }

    if (this.editingId === null) {
      // 🆕 CREAR
      const existe = this.obras.some((o) => o.id === this.obraForm.id);
      if (existe) {
        console.error('ERROR: Ya existe una Obra Pública con ese ID. Por favor, usa otro.');
        return;
      }

      const nueva: ObraPublica = { ...this.obraForm };
      this.obras.push(nueva);
    } else {
      // ✏️ EDITAR
      const idx = this.obras.findIndex((o) => o.id === this.editingId);
      if (idx > -1) {
        this.obras[idx] = { ...this.obraForm };
      }
    }

    this.obrasFiltradas = [...this.obras];
    this.showForm = false;
    this.editingId = null;
    this.obraForm = this.crearFormVacio();
    this.searchId = null;
    console.log('Obras Públicas actualizadas:', this.obras);
  }

  private validarCampos(): boolean {
    if (
      !this.obraForm.id ||
      !this.obraForm.nombre ||
      !this.obraForm.fechaInicio ||
      !this.obraForm.fechaFin ||
      !this.obraForm.idGobierno ||
      !this.obraForm.idExpediente
    ) {
      console.error('ERROR: Los campos ID, Nombre, Fechas, ID Gobierno e ID Expediente son obligatorios.');
      return false;
    }

    if (this.obraForm.fechaInicio > this.obraForm.fechaFin) {
      console.error('ERROR: La Fecha de Inicio no puede ser posterior a la Fecha de Fin.');
      return false;
    }

    return true;
  }

  /* 🔍 BÚSQUEDA */
  buscarPorId(): void {
    this.showForm = false;

    if (this.searchId === null || this.searchId === undefined) {
      this.obrasFiltradas = [...this.obras];
      return;
    }

    this.obrasFiltradas = this.obras.filter((o) => o.id === this.searchId);

    if (this.obrasFiltradas.length === 0) {
      console.error('No se encontró ninguna Obra Pública con ese ID.');
    }
  }

  limpiarBusqueda(): void {
    this.searchId = null;
    this.obrasFiltradas = [...this.obras];
  }

  /* ✏️ EDICIÓN Y ELIMINACIÓN */
  editarObra(obra: ObraPublica): void {
    this.showForm = true;
    this.editingId = obra.id;
    this.obraForm = { ...obra };
  }

  eliminarObra(obra: ObraPublica): void {
    const isConfirmed = window.confirm(
      `¿Seguro que deseas eliminar la Obra Pública con ID ${obra.id}?`
    );

    if (!isConfirmed) return;

    this.obras = this.obras.filter((o) => o.id !== obra.id);
    this.obrasFiltradas = [...this.obras];
    this.searchId = null;

    if (this.detalleSeleccionado?.id === obra.id) {
      this.cerrarDetalle();
    }
  }

  /* 👁 MODAL DETALLE */
  verDetalle(o: ObraPublica): void {
    this.detalleSeleccionado = o;
    this.detailOpen = true;
  }

  cerrarDetalle(): void {
    this.detailOpen = false;
    this.detalleSeleccionado = null;
  }

  // Función auxiliar para obtener la clase de color del estado
  getEstadoClass(estado: ObraPublica['estado']): string {
    switch (estado) {
      case 'Finalizada':
        return 'status-finalizada';
      case 'En Ejecución':
        return 'status-ejecucion';
      case 'Pendiente':
        return 'status-pendiente';
      case 'Cancelada':
        return 'status-cancelada';
      default:
        return 'status-pendiente';
    }
  }

  // Cerrar modal con ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.detailOpen) this.cerrarDetalle();
  }
}
