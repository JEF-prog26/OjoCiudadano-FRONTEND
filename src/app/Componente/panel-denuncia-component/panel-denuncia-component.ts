import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';

/* ===== Estados tipados ===== */
type Estado =
  | 'Registrada'
  | 'En revisión (preliminar)'
  | 'En investigación (fiscal o policial)'
  | 'En evaluación judicial / etapa intermedia'
  | 'En juicio'
  | 'Con sentencia'
  | 'Archivada / Concluida';

const ESTADOS: Estado[] = [
  'Registrada',
  'En revisión (preliminar)',
  'En investigación (fiscal o policial)',
  'En evaluación judicial / etapa intermedia',
  'En juicio',
  'Con sentencia',
  'Archivada / Concluida',
];

/* ===== Interfaces ===== */
interface HistorialEvento {
  estado: Estado;
  descripcion?: string;
  fecha: string; // 'YYYY-MM-DD'
}

interface Denuncia {
  id: number;
  titulo: string;
  descripcion: string;
  fechaDenuncia: string;
  estado: Estado;
  historial?: HistorialEvento[];
}

@Component({
  selector: 'app-panel-denuncia-component',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-denuncia-component.html',
  styleUrl: './panel-denuncia-component.css',
})
export class PanelDenunciaComponent {
  /* Exponer lista de estados al template (para el <select>) */
  ESTADOS = ESTADOS;

  showForm = false;
  editingId: number | null = null; // null = creando, != null = editando

  denunciaForm: Denuncia = this.crearFormVacio();
  denuncias: Denuncia[] = [];
  denunciasFiltradas: Denuncia[] = [];

  // 🔍 valor del buscador por ID
  searchId: number | null = null;

  // 🧩 modal detalle
  detailOpen = false;
  detalleSeleccionado: Denuncia | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.denunciasFiltradas = this.denuncias;
  }

  private crearFormVacio(): Denuncia {
    return {
      id: 0,
      titulo: '',
      descripcion: '',
      fechaDenuncia: '',
      estado: 'Registrada', // 🔒 default en creación
      historial: [],
    };
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }

  onRegistrarClick(): void {
    this.showForm = true;
    this.editingId = null;
    this.denunciaForm = this.crearFormVacio();
  }

  cancelarForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.denunciaForm = this.crearFormVacio();
  }

  guardarDenuncia(): void {
    if (!this.denunciaForm.titulo || !this.denunciaForm.descripcion) {
      alert('Completa al menos Título y Descripción.');
      return;
    }

    // Fecha por defecto si está vacía
    if (!this.denunciaForm.fechaDenuncia) {
      this.denunciaForm.fechaDenuncia = new Date().toISOString().slice(0, 10);
    }

    if (this.editingId === null) {
      // 🆕 CREAR: estado forzado a "Registrada"
      const existe = this.denuncias.some((d) => d.id === this.denunciaForm.id);
      if (existe) {
        alert('Ya existe una denuncia con ese ID.');
        return;
      }

      const nueva: Denuncia = {
        ...this.denunciaForm,
        estado: 'Registrada',
        historial: [
          {
            estado: 'Registrada',
            descripcion: 'Denuncia registrada.',
            fecha: this.denunciaForm.fechaDenuncia,
          },
        ],
      };

      this.denuncias.push(nueva);
    } else {
      // ✏️ EDITAR: permitir cambiar estado y registrar cambio en historial
      const idx = this.denuncias.findIndex((d) => d.id === this.editingId);
      if (idx > -1) {
        const anterior = this.denuncias[idx];
        const prevHist = anterior.historial ?? [];

        if (anterior.estado !== this.denunciaForm.estado) {
          prevHist.push({
            estado: this.denunciaForm.estado,
            descripcion: `Estado actualizado de "${anterior.estado}" a "${this.denunciaForm.estado}".`,
            fecha: new Date().toISOString().slice(0, 10),
          });
        }

        this.denuncias[idx] = { ...this.denunciaForm, historial: prevHist };
      }
    }

    this.denunciasFiltradas = [...this.denuncias];
    this.showForm = false;
    this.editingId = null;
    this.denunciaForm = this.crearFormVacio();
    this.searchId = null;
  }

  // 🔍 Buscar por ID usando el buscador de arriba
  buscarPorId(): void {
    this.showForm = false;

    if (this.searchId === null || this.searchId === undefined) {
      this.denunciasFiltradas = [...this.denuncias];
      return;
    }

    this.denunciasFiltradas = this.denuncias.filter(
      (d) => d.id === this.searchId
    );

    if (this.denunciasFiltradas.length === 0) {
      alert('No se encontró ninguna denuncia con ese ID.');
    }
  }

  limpiarBusqueda(): void {
    this.searchId = null;
    this.denunciasFiltradas = [...this.denuncias];
  }

  // ✏️ EDITAR DESDE LA TABLA
  editarDenuncia(denuncia: Denuncia): void {
    this.showForm = true;
    this.editingId = denuncia.id;
    this.denunciaForm = { ...denuncia };
    if (!this.denunciaForm.historial) this.denunciaForm.historial = [];
  }

  // 🗑 ELIMINAR DESDE LA TABLA
  eliminarDenuncia(denuncia: Denuncia): void {
    const ok = confirm(
      `¿Seguro que deseas eliminar la denuncia con ID ${denuncia.id}?`
    );
    if (!ok) return;

    this.denuncias = this.denuncias.filter((d) => d.id !== denuncia.id);
    this.denunciasFiltradas = [...this.denuncias];
    this.searchId = null;

    if (this.detalleSeleccionado?.id === denuncia.id) {
      this.cerrarDetalle();
    }
  }

  // 👁 VER DETALLE (abre modal)
  verDetalle(d: Denuncia): void {
    if (!d.historial || d.historial.length === 0) {
      d.historial = [
        {
          estado: d.estado || 'Registrada',
          descripcion: 'Denuncia registrada.',
          fecha: d.fechaDenuncia || new Date().toISOString().slice(0, 10),
        },
      ];
    }
    this.detalleSeleccionado = d;
    this.detailOpen = true;
  }

  cerrarDetalle(): void {
    this.detailOpen = false;
    this.detalleSeleccionado = null;
  }

  // 🎨 Clase CSS por estado (para badges y timeline)
  estadoClass(estado?: string): string {
    const e = (estado || '').toLowerCase();

    if (e.startsWith('registrada')) return 'estado-registrada';
    if (e.startsWith('en revisión')) return 'estado-revision';
    if (e.startsWith('en investigación')) return 'estado-investigacion';
    if (e.startsWith('en evaluación')) return 'estado-intermedia';
    if (e.startsWith('en juicio')) return 'estado-juicio';
    if (e.startsWith('con sentencia')) return 'estado-sentencia';
    if (e.startsWith('archivada') || e.startsWith('concluida'))
      return 'estado-archivada';

    return 'estado-registrada';
  }

  // Cerrar modal con ESC (opcional)
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.detailOpen) this.cerrarDetalle();
  }
}
