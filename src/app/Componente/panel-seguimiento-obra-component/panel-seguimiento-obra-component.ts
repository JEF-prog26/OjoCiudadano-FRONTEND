import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {SeguimientoObraService} from '../../services/seguimientoObra-service';
import {ObraPublicaService} from '../../services/obraPublica-service';
import {UserService} from '../../services/user-service';
import {SeguimientoObra} from '../../model/seguimientoObra';
import {ObraPublica} from '../../model/obraPublica';
import {User} from '../../model/user';

@Component({
  selector: 'app-panel-seguimiento-obra-component',
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-seguimiento-obra-component.html',
  styleUrl: './panel-seguimiento-obra-component.css',
})
export class PanelSeguimientoObraComponent implements OnInit {
  // Inyecciones
  private seguimientoService = inject(SeguimientoObraService);
  private obraService = inject(ObraPublicaService);
  private userService = inject(UserService);

  // Data Base
  seguimientos = signal<SeguimientoObra[]>([]);
  obrasDisponibles = signal<ObraPublica[]>([]);
  usuariosDisponibles = signal<User[]>([]);

  // Formulario
  editingId = signal<number | null>(null);
  seguimientoForm: SeguimientoObra = new SeguimientoObra();

  // Selecciones temporales
  selectedObra: ObraPublica | null = null;
  selectedUser: User | null = null;

  // Filtro de búsqueda
  searchId = signal<number | null>(null);

  // Computed para filtrar tabla
  seguimientosFiltrados = computed(() => {
    const id = this.searchId();
    const list = this.seguimientos();
    if (!id) return list;
    return list.filter(s => s.id === id);
  });

  ngOnInit(): void {
    // 1. Cargar Seguimientos
    this.seguimientoService.list().subscribe(data => this.seguimientos.set(data));
    this.seguimientoService.getListaCambio().subscribe(data => this.seguimientos.set(data));

    // 2. Cargar Obras y Usuarios para los selects
    this.obraService.list().subscribe(data => this.obrasDisponibles.set(data));
    this.userService.list().subscribe(data => this.usuariosDisponibles.set(data));

    // Inicializar fecha hoy
    this.seguimientoForm.fechaInicio = new Date().toISOString().slice(0, 10);
    this.seguimientoForm.activo = true;
  }

  // --- CRUD ---

  guardar(): void {
    if (!this.seguimientoForm.fechaInicio || !this.selectedObra || !this.selectedUser) {
      alert('Complete la Fecha, seleccione una Obra y un Responsable.');
      return;
    }

    // Asignar relaciones
    this.seguimientoForm.obraPublica = this.selectedObra;
    this.seguimientoForm.usuario = this.selectedUser;

    if (this.editingId() === null) {
      // CREAR
      this.seguimientoService.insert(this.seguimientoForm).subscribe(() => {
        this.seguimientoService.actualizarLista();
        this.cancelar(); // Limpiar
        alert('Seguimiento registrado');
      });
    } else {
      // EDITAR
      this.seguimientoService.update(this.seguimientoForm, this.seguimientoForm.id).subscribe(() => {
        this.seguimientoService.actualizarLista();
        this.cancelar();
        alert('Seguimiento actualizado');
      });
    }
  }

  editar(s: SeguimientoObra): void {
    this.editingId.set(s.id);
    this.seguimientoForm = { ...s }; // Clonar

    // Pre-seleccionar selects
    if (s.obraPublica) {
      this.selectedObra = this.obrasDisponibles().find(o => o.idObra === s.obraPublica.idObra) || null;
    }
    if (s.usuario) {
      this.selectedUser = this.usuariosDisponibles().find(u => u.id === s.usuario.id) || null;
    }
  }

  eliminar(): void {
    const id = this.editingId();
    if (!id) return;

    if (confirm(`¿Eliminar seguimiento #${id}?`)) {
      this.seguimientoService.delete(id).subscribe(() => {
        this.seguimientoService.actualizarLista();
        this.cancelar();
      });
    }
  }

  cancelar(): void {
    this.editingId.set(null);
    this.seguimientoForm = new SeguimientoObra();
    this.seguimientoForm.fechaInicio = new Date().toISOString().slice(0, 10);
    this.seguimientoForm.activo = true;
    this.selectedObra = null;
    this.selectedUser = null;
    this.searchId.set(null);
  }

  // Búsqueda Manual (Botón Buscar)
  buscar(): void {
    // El computed ya filtra, pero si quieres llamar al backend:
    const id = this.searchId();
    if (id) {
      this.seguimientoService.listId(id).subscribe({
        next: (res) => this.seguimientos.set([res]),
        error: () => alert('ID no encontrado')
      });
    } else {
      this.seguimientoService.actualizarLista();
    }
  }
}
