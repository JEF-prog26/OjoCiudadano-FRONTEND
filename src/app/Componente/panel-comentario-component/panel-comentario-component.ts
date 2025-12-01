import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {ComentarioService} from '../../services/comentario-service';
import {UserService} from '../../services/user-service';
import {ObraPublicaService} from '../../services/obraPublica-service';
import {Comentario} from '../../model/comentario';
import {User} from '../../model/user';
import {ObraPublica} from '../../model/obraPublica';

@Component({
  selector: 'app-panel-comentario-component',
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-comentario-component.html',
  styleUrl: './panel-comentario-component.css',
})
export class PanelComentarioComponent implements OnInit {
  // Inyecciones
  private comentarioService = inject(ComentarioService);
  private userService = inject(UserService);
  private obraService = inject(ObraPublicaService);

  // Data Base
  todosLosComentarios = signal<Comentario[]>([]);
  usuarios = signal<User[]>([]);
  obras = signal<ObraPublica[]>([]);

  // Estado de Filtro y Vista
  filterObra = signal<ObraPublica | null>(null);
  comentariosFiltrados = signal<Comentario[]>([]);

  // Estado del Formulario
  editingId = signal<number | null>(null);
  comentarioForm: Comentario = new Comentario();

  // Selecciones del Formulario
  selectedUser: User | null = null;
  selectedObraForm: ObraPublica | null = null;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargar Usuarios y Obras para los desplegables
    this.userService.list().subscribe(data => this.usuarios.set(data));
    this.obraService.list().subscribe(data => this.obras.set(data));

    // 2. Cargar Comentarios y suscribirse a cambios
    this.comentarioService.list().subscribe(data => {
      this.todosLosComentarios.set(data);
      this.filtrarComentarios(); // Aplicar filtro inicial
    });

    this.comentarioService.getListaCambio().subscribe(data => {
      this.todosLosComentarios.set(data);
      this.filtrarComentarios();
    });
  }

  // --- LÓGICA DE FILTRADO (FEED) ---
  filtrarComentarios() {
    const obra = this.filterObra();
    if (obra) {
      // Filtrar solo los de la obra seleccionada
      const filtrados = this.todosLosComentarios().filter(c => c.obraPublica?.idObra === obra.idObra);
      this.comentariosFiltrados.set(filtrados);

      // Auto-seleccionar la obra en el formulario para comodidad
      this.selectedObraForm = this.obras().find(o => o.idObra === obra.idObra) || null;
    } else {
      // Mostrar todos
      this.comentariosFiltrados.set(this.todosLosComentarios());
    }
  }

  // --- CRUD ---

  seleccionarComentario(c: Comentario) {
    this.editingId.set(c.id);
    this.comentarioForm = { ...c }; // Clonar datos

    // Mapear relaciones para los selects
    if (c.usuario) {
      this.selectedUser = this.usuarios().find(u => u.id === c.usuario.id) || null;
    }
    if (c.obraPublica) {
      this.selectedObraForm = this.obras().find(o => o.idObra === c.obraPublica.idObra) || null;
    }
  }

  resetForm() {
    this.editingId.set(null);
    this.comentarioForm = new Comentario();
    this.comentarioForm.fechaComentario = new Date().toISOString().slice(0, 10); // Fecha hoy
    this.selectedUser = null;
    // No reseteamos la obra si hay un filtro activo, por comodidad
    if (!this.filterObra()) {
      this.selectedObraForm = null;
    }
  }

  guardar() {
    if (!this.comentarioForm.contenido || !this.selectedUser || !this.selectedObraForm) {
      alert('Debe seleccionar Usuario, Obra y escribir un mensaje.');
      return;
    }

    // Asignar relaciones
    this.comentarioForm.usuario = this.selectedUser;
    this.comentarioForm.obraPublica = this.selectedObraForm;

    if (this.editingId() === null) {
      // CREAR
      this.comentarioService.insert(this.comentarioForm).subscribe(() => {
        this.comentarioService.actualizarLista();
        this.resetForm();
      });
    } else {
      // EDITAR
      this.comentarioService.update(this.comentarioForm, this.comentarioForm.id).subscribe(() => {
        this.comentarioService.actualizarLista();
        this.resetForm();
      });
    }
  }

  eliminar() {
    if (!this.editingId()) return;

    if (confirm('¿Seguro que desea eliminar este comentario?')) {
      this.comentarioService.delete(this.editingId()!).subscribe(() => {
        this.comentarioService.actualizarLista();
        this.resetForm();
      });
    }
  }

  // --- HELPERS VISUALES ---
  // Genera un color pastel aleatorio basado en el nombre para el avatar
  getColorAvatar(nombre: string = '?'): string {
    const colores = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
    const index = nombre.charCodeAt(0) % colores.length;
    return colores[index];
  }
}
