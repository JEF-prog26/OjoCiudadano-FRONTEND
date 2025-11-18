import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
/* ===== Estados tipados ===== */
type Estado =
  | 'Publicado';
const ESTADOS: Estado[] = [
  'Publicado',
];
/* ===== Interfaces ===== */
interface HistorialEvento {
  estado: Estado;
  descripcion?: string;
  fecha: string; // 'YYYY-MM-DD'
}
interface Comentario {
  id: number;
  titulo: string;
  descripcion: string;
  fechaComentario: string;
  estado: Estado;
  historial?: HistorialEvento[];
}
@Component({
  selector: 'app-panel-comentario-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-comentario-component.html',
  styleUrl: './panel-comentario-component.css',
})
export class PanelComentarioComponent {
  /* Exponer lista de estados al template (para el <select>) */
  ESTADOS = ESTADOS;
  showForm = false;
  editingId: number | null = null; // null = creando, != null = editando
  comentarioForm: Comentario = this.crearFormVacio();
  comentarios: Comentario[] = [];
  comentariosFiltrados: Comentario[] = [];
  nuevoComentarioTexto: string = '';
// 🔍 valor del buscador por ID
  searchId: number | null = null;
// 🧩 modal detalle
  detailOpen = false;
  detalleSeleccionado: Comentario | null = null;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.comentariosFiltrados = this.comentarios;
  }
  private crearFormVacio(): Comentario {
    return {
      id: 0,
      titulo: '',
      descripcion: '',
      fechaComentario: '',
      estado: 'Publicado', // 🔒 default en creación
      historial: [],
    };
  }
  registrarRapido(): void {
    if (!this.nuevoComentarioTexto.trim()) return;
    const maxId = this.comentarios.length > 0
      ? Math.max(...this.comentarios.map(c => c.id))
      : 0;
    const nuevo: Comentario = {
      id: maxId + 1,
      titulo: 'Comentario Rápido', // Título por defecto
      descripcion: this.nuevoComentarioTexto,
      fechaComentario: new Date().toISOString().slice(0, 10),
      estado: 'Publicado',
      historial: [
        {
          estado: 'Publicado',
          descripcion: 'Registrado desde el chat rápido.',
          fecha: new Date().toISOString().slice(0, 10),
        },
      ],
    };
    // Agregamos al array principal
    this.comentarios.push(nuevo);
    // Actualizamos la vista filtrada (la tabla y el chat comparten la misma fuente)
    this.comentariosFiltrados = [...this.comentarios];
    // Limpiamos el input
    this.nuevoComentarioTexto = '';
    // Opcional: Scroll al fondo del chat (requiere ViewChild, pero por ahora esto basta)
  }
  goBack(): void {
    this.router.navigateByUrl('/');
  }
  onRegistrarClick(): void {
    this.showForm = true;
    this.editingId = null;
    this.comentarioForm = this.crearFormVacio();
  }
  cancelarForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.comentarioForm = this.crearFormVacio();
  }
  guardarComentario(): void {
    if (!this.comentarioForm.descripcion) {
      alert('Completa la Descripción.');
      return;
    }
    const fechaActual = new Date().toISOString().slice(0, 10);
// Si el formulario no tiene fecha o si estamos creando, la establecemos
    if (!this.comentarioForm.fechaComentario || this.editingId === null) {
      this.comentarioForm.fechaComentario = fechaActual;
    }
    if (this.editingId === null) {
// 🆕 CREAR: ¡AQUÍ ESTÁ LA MAGIA!
// 1. Calculamos el ID máximo actual.
// Si la lista está vacía, el máximo es 0. Si tiene datos, busca el mayor.
      const maxId = this.comentarios.length > 0
        ? Math.max(...this.comentarios.map(c => c.id))
        : 0;
// 2. Asignamos el nuevo ID (Máximo + 1)
      const nuevoId = maxId + 1;
// 3. Asignamos este ID al formulario antes de guardar
      this.comentarioForm.id = nuevoId;
// Ya NO necesitamos preguntar si existe, porque acabamos de inventar uno nuevo.
      const nueva: Comentario = {
        ...this.comentarioForm,
        estado: 'Publicado',
        historial: [
          {
            estado: 'Publicado',
            descripcion: 'Comentario registrada.',
            fecha: this.comentarioForm.fechaComentario,
          },
        ],
      };
      this.comentarios.push(nueva);
    } else {
// ✏️ EDITAR: permitir cambiar estado y registrar cambio en historial
      const idx = this.comentarios.findIndex((d) => d.id === this.editingId);
      if (idx > -1) {
        const anterior = this.comentarios[idx];
        const prevHist = anterior.historial ?? [];
        if (anterior.estado !== this.comentarioForm.estado) {
          prevHist.push({
            estado: this.comentarioForm.estado,
            descripcion: `Estado actualizado de "${anterior.estado}" a "${this.comentarioForm.estado}".`,
            fecha: new Date().toISOString().slice(0, 10),
          });
        }
        this.comentarios[idx] = { ...this.comentarioForm, historial: prevHist };
      }
    }
    this.comentariosFiltrados = [...this.comentarios];
    this.showForm = false;
    this.editingId = null;
    this.comentarioForm = this.crearFormVacio();
    this.searchId = null;
  }
// 🔍 Buscar por ID usando el buscador de arriba
  buscarPorId(): void {
    this.showForm = false;
    if (this.searchId === null || this.searchId === undefined) {
      this.comentariosFiltrados = [...this.comentarios];
      return;
    }
    this.comentariosFiltrados = this.comentarios.filter(
      (d) => d.id === this.searchId
    );
    if (this.comentariosFiltrados.length === 0) {
      alert('No se encontró ningun comentario con ese ID.');
    }
  }
  limpiarBusqueda(): void {
    this.searchId = null;
    this.comentariosFiltrados = [...this.comentarios];
  }
// ✏️ EDITAR DESDE LA TABLA
  editarComentario(comentario: Comentario): void {
    this.showForm = true;
    this.editingId = comentario.id;
    this.comentarioForm = { ...comentario };
    if (!this.comentarioForm.historial) this.comentarioForm.historial = [];
  }
// 🗑 ELIMINAR DESDE LA TABLA
  eliminarComentario(comentario: Comentario): void {
    const ok = confirm(
      `¿Seguro que deseas eliminar el comentario con ID ${comentario.id}?`
    );
    if (!ok) return;
    this.comentarios = this.comentarios.filter((d) => d.id !== comentario.id);
    this.comentariosFiltrados = [...this.comentarios];
    this.searchId = null;
    if (this.detalleSeleccionado?.id === comentario.id) {
      this.cerrarDetalle();
    }
  }
// 👁 VER DETALLE (abre modal)
  verDetalle(d: Comentario): void {
    if (!d.historial || d.historial.length === 0) {
      d.historial = [
        {
          estado: d.estado || 'Publicado',
          descripcion: 'Comentario registrado.',
          fecha: d.fechaComentario || new Date().toISOString().slice(0, 10),
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
    if (e.startsWith('publicado')) return 'estado-publicado';
    if (e.startsWith('archivado') || e.startsWith('concluido'))
      return 'estado-archivado';
    return 'estado-publicado';
  }
// Cerrar modal con ESC (opcional)
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.detailOpen) this.cerrarDetalle();
  }
}
