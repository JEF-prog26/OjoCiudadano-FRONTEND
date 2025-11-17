import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ===== Interfaces ===== */
interface Notificacion {
  id: number;
  mensaje: string;
  fecha: string; // 'YYYY-MM-DD' o Date
  leida: boolean;
  tipo: 'Alerta' | 'Sistema' | 'Info' | string;
}

@Component({
  selector: 'app-panel-notificacion-component',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './panel-notificacion-component.html',
  styleUrl: './panel-notificacion-component.css',
})
export class PanelNotificacionComponent {
  showForm = false;
  editingId: number | null = null;

  notificacionForm: Notificacion = this.crearFormVacio();
  notificaciones: Notificacion[] = [
    // Datos de ejemplo
    {
      id: 101,
      mensaje: 'Nueva denuncia registrada en el sector centro y requiere asignación urgente.',
      fecha: new Date().toISOString().slice(0, 10),
      leida: false,
      tipo: 'Alerta',
    },
    {
      id: 102,
      mensaje: 'El sistema fue actualizado a la versión 2.0 y ya puede usar el nuevo módulo.',
      fecha: '2025-11-15',
      leida: true,
      tipo: 'Sistema',
    },
    {
      id: 103,
      mensaje: 'Revisa las evidencias pendientes de aprobación en el caso 2025-004.',
      fecha: '2025-11-17',
      leida: false,
      tipo: 'Info',
    },
  ];
  notificacionesFiltradas: Notificacion[] = [];

  // 🔍 valor del buscador por ID
  searchId: number | null = null;

  // 🧩 modal detalle
  detailOpen = false;
  detalleSeleccionado: Notificacion | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.notificacionesFiltradas = this.notificaciones;
  }

  private crearFormVacio(): Notificacion {
    return {
      id: 0,
      mensaje: '',
      fecha: new Date().toISOString().slice(0, 10), // Fecha actual por defecto
      leida: false,
      tipo: 'Info',
    };
  }

  goBack(): void {
    // Implementación real debe navegar a una ruta existente, ej:
    // this.router.navigate(['/home']);
    // Por ahora, solo simula volver:
    console.log("Volviendo...");
  }

  onRegistrarClick(): void {
    this.showForm = true;
    this.editingId = null;
    this.notificacionForm = this.crearFormVacio();
  }

  cancelarForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.notificacionForm = this.crearFormVacio();
  }

  guardarNotificacion(): void {
    if (!this.notificacionForm.mensaje) {
      alert('El campo Mensaje no puede estar vacío.');
      return;
    }

    if (this.editingId === null) {
      // 🆕 CREAR
      const existe = this.notificaciones.some((n) => n.id === this.notificacionForm.id);
      if (existe) {
        alert('Ya existe una notificación con ese ID.');
        return;
      }
      this.notificaciones.push({ ...this.notificacionForm });

    } else {
      // ✏️ EDITAR
      const idx = this.notificaciones.findIndex((n) => n.id === this.editingId);
      if (idx > -1) {
        this.notificaciones[idx] = { ...this.notificacionForm };
      }
    }

    this.notificacionesFiltradas = [...this.notificaciones];
    this.showForm = false;
    this.editingId = null;
    this.notificacionForm = this.crearFormVacio();
    this.searchId = null;
  }

  // 🔎 Buscar por ID
  buscarPorId(): void {
    this.showForm = false;

    if (this.searchId === null || this.searchId === undefined) {
      this.notificacionesFiltradas = [...this.notificaciones];
      return;
    }

    this.notificacionesFiltradas = this.notificaciones.filter(
      (n) => n.id === this.searchId
    );

    if (this.notificacionesFiltradas.length === 0) {
      alert('No se encontró ninguna notificación con ese ID.');
    }
  }

  limpiarBusqueda(): void {
    this.searchId = null;
    this.notificacionesFiltradas = [...this.notificaciones];
  }

  // 🗑 ELIMINAR DESDE LA TABLA
  eliminarNotificacion(notificacion: Notificacion): void {
    const ok = confirm(
      `¿Seguro que deseas eliminar la notificación con ID ${notificacion.id}?`
    );
    if (!ok) return;

    this.notificaciones = this.notificaciones.filter((n) => n.id !== notificacion.id);
    this.notificacionesFiltradas = [...this.notificaciones];
    this.searchId = null;

    if (this.detalleSeleccionado?.id === notificacion.id) {
      this.cerrarDetalle();
    }
  }

  // 🆕 ACCIÓN ADICIONAL: MARCAR COMO LEÍDA
  marcarComoLeida(notificacion: Notificacion): void {
    const idx = this.notificaciones.findIndex(n => n.id === notificacion.id);
    if (idx > -1) {
      this.notificaciones[idx].leida = true;
      // Actualizar la lista filtrada si es necesario
      this.notificacionesFiltradas = [...this.notificaciones];
    }
  }

  // 👁 VER DETALLE (abre modal)
  verDetalle(n: Notificacion): void {
    // Cuando ves el detalle, asumes que la lees
    if (!n.leida) {
      this.marcarComoLeida(n);
    }
    this.detalleSeleccionado = n;
    this.detailOpen = true;
  }

  cerrarDetalle(): void {
    this.detailOpen = false;
    this.detalleSeleccionado = null;
  }

  // 🎨 Clase CSS por tipo (para resaltar la celda en la tabla)
  tipoClass(tipo?: string): string {
    const t = (tipo || '').toLowerCase();
    if (t.includes('alerta')) return 'tipo-alerta';
    if (t.includes('sistema')) return 'tipo-sistema';
    return ''; // Sin clase específica para 'Info' u otros
  }

  // Cerrar modal con ESC (opcional)
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.detailOpen) this.cerrarDetalle();
  }
}
