import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para ngIf y ngFor
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

/* ===== Interfaces ===== */
interface GobiernoRegional {
  id: number;
  nombre: string; // Nombre del Gobierno Regional (e.g., Gobierno Regional de Lima)
  ubicacion: string; // Departamento/Provincia
  contacto: string; // Correo o Teléfono de contacto
}

@Component({
  selector: 'app-panel-gobierno-regional-component',
  standalone: true, // Asegura que se usa como componente standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-gobierno-regional-component.html',
  styleUrl: './panel-gobierno-regional-component.css',
})
export class PanelGobiernoRegionalComponent implements OnInit {
  showForm = false;
  editingId: number | null = null; // null = creando, != null = editando

  gobiernoForm: GobiernoRegional = this.crearFormVacio();
  gobiernos: GobiernoRegional[] = [];
  gobiernosFiltrados: GobiernoRegional[] = [];

  // 🔍 valor del buscador por ID
  searchId: number | null = null;

  // 🧩 modal detalle
  detailOpen = false;
  detalleSeleccionado: GobiernoRegional | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.gobiernosFiltrados = this.gobiernos;
  }

  private crearFormVacio(): GobiernoRegional {
    return {
      id: 0,
      nombre: '',
      ubicacion: '',
      contacto: '',
    };
  }

  // Permite volver a la página anterior (funcionalidad solicitada)
  goBack(): void {
    history.back();
    console.log('Navegación: Volver al estado anterior del navegador.');
  }

  /* 🆕 REGISTRO */
  onRegistrarClick(): void {
    this.showForm = true;
    this.editingId = null;
    this.gobiernoForm = this.crearFormVacio();
  }

  cancelarForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.gobiernoForm = this.crearFormVacio();
  }

  guardarGobierno(): void {
    if (!this.gobiernoForm.id || !this.gobiernoForm.nombre || !this.gobiernoForm.ubicacion || !this.gobiernoForm.contacto) {
      console.error('ERROR: Todos los campos (ID, Nombre, Ubicación, Contacto) son obligatorios.');
      return;
    }

    if (this.editingId === null) {
      // 🆕 CREAR
      const existe = this.gobiernos.some((g) => g.id === this.gobiernoForm.id);
      if (existe) {
        console.error('ERROR: Ya existe un Gobierno Regional con ese ID. Por favor, usa otro.');
        return;
      }

      const nuevo: GobiernoRegional = { ...this.gobiernoForm };
      this.gobiernos.push(nuevo);
    } else {
      // ✏️ EDITAR
      const idx = this.gobiernos.findIndex((g) => g.id === this.editingId);
      if (idx > -1) {
        this.gobiernos[idx] = { ...this.gobiernoForm };
      }
    }

    this.gobiernosFiltrados = [...this.gobiernos];
    this.showForm = false;
    this.editingId = null;
    this.gobiernoForm = this.crearFormVacio();
    this.searchId = null;
    console.log('Gobiernos Regionales actualizados:', this.gobiernos);
  }

  /* 🔍 BÚSQUEDA */
  buscarPorId(): void {
    this.showForm = false;

    if (this.searchId === null || this.searchId === undefined) {
      this.gobiernosFiltrados = [...this.gobiernos];
      return;
    }

    this.gobiernosFiltrados = this.gobiernos.filter(
      (g) => g.id === this.searchId
    );

    if (this.gobiernosFiltrados.length === 0) {
      console.error('No se encontró ningún Gobierno Regional con ese ID.');
    }
  }

  limpiarBusqueda(): void {
    this.searchId = null;
    this.gobiernosFiltrados = [...this.gobiernos];
  }

  /* ✏️ EDICIÓN Y ELIMINACIÓN */
  editarGobierno(gobierno: GobiernoRegional): void {
    this.showForm = true;
    this.editingId = gobierno.id;
    this.gobiernoForm = { ...gobierno };
  }

  eliminarGobierno(gobierno: GobiernoRegional): void {
    const isConfirmed = window.confirm(
      `¿Seguro que deseas eliminar el Gobierno Regional con ID ${gobierno.id}?`
    );

    if (!isConfirmed) return;

    this.gobiernos = this.gobiernos.filter((g) => g.id !== gobierno.id);
    this.gobiernosFiltrados = [...this.gobiernos];
    this.searchId = null;

    if (this.detalleSeleccionado?.id === gobierno.id) {
      this.cerrarDetalle();
    }
  }

  /* 👁 MODAL DETALLE */
  verDetalle(g: GobiernoRegional): void {
    this.detalleSeleccionado = g;
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
