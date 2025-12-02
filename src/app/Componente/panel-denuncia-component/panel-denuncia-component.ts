import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import {DenunciaService} from '../../services/denuncia-service';
import {UserService} from '../../services/user-service';
import {ObraPublicaService} from '../../services/obraPublica-service';
import {Denuncia} from '../../model/denuncia';
import {User} from '../../model/user';
import {ObraPublica} from '../../model/obraPublica';

@Component({
  selector: 'app-panel-denuncia-component',
  imports: [CommonModule, FormsModule, HeaderPanelComponent],
  templateUrl: './panel-denuncia-component.html',
  styleUrl: './panel-denuncia-component.css',
})
export class PanelDenunciaComponent implements OnInit{
  // Inyecciones
  private denunciaService = inject(DenunciaService);
  private userService = inject(UserService);
  private obraService = inject(ObraPublicaService);
  rolActualUsuario: string | null = null;

  // Estados de datos
  denuncias = signal<Denuncia[]>([]);
  usuariosDisponibles = signal<User[]>([]);
  obrasDisponibles = signal<ObraPublica[]>([]);

  // Formulario
  showForm = signal(false);
  editingId = signal<number | null>(null);
  denunciaForm: Denuncia = new Denuncia();

  // Selecciones temporales
  selectedUser: User | null = null;
  selectedObra: ObraPublica | null = null;

  // UI
  searchId = signal<number | null>(null);
  detailOpen = signal(false);
  detalleSeleccionado = signal<Denuncia | null>(null);

  // Filtro (usando idDenuncia)
  denunciasFiltradas = computed(() => {
    const search = this.searchId();
    const list = this.denuncias();
    if (!search) return list;
    return list.filter(d => d.idDenuncia === search);
  });

  ngOnInit(): void {
    this.rolActualUsuario = localStorage.getItem('rol');
    // 1. Cargar Denuncias
    this.denunciaService.list().subscribe(data => this.denuncias.set(data));
    this.denunciaService.getListaCambio().subscribe(data => this.denuncias.set(data));

    // 2. Cargar listas para dropdowns
    this.userService.list().subscribe(data => this.usuariosDisponibles.set(data));
    this.obraService.list().subscribe(data => this.obrasDisponibles.set(data));
  }

  esAdminODev(): boolean{
    return this.rolActualUsuario === 'ROLE_ADMIN'|| this.rolActualUsuario === 'ROLE_DESARROLLADOR';
  }

  // --- CRUD ---

  onRegistrarClick(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.denunciaForm = new Denuncia();
    this.selectedUser = null;
    this.selectedObra = null;
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  guardar(): void {
    if (!this.denunciaForm.titulo || !this.selectedUser || !this.selectedObra) {
      alert('Complete Título, Usuario y Obra.');
      return;
    }

    // Asignar relaciones
    this.denunciaForm.usuario = this.selectedUser;
    this.denunciaForm.obraPublica = this.selectedObra;

    if (this.editingId() === null) {
      // CREAR
      this.denunciaService.insert(this.denunciaForm).subscribe(() => {
        this.denunciaService.actualizarLista();
        this.showForm.set(false);
        alert('Denuncia registrada');
      });
    } else {
      // EDITAR (Usando idDenuncia)
      this.denunciaService.update(this.denunciaForm, this.denunciaForm.idDenuncia).subscribe(() => {
        this.denunciaService.actualizarLista();
        this.showForm.set(false);
        alert('Denuncia actualizada');
      });
    }
  }

  editar(d: Denuncia): void {
    this.showForm.set(true);
    this.editingId.set(d.idDenuncia);
    this.denunciaForm = { ...d }; // Clonar

    // Pre-seleccionar
    if (d.usuario) {
      this.selectedUser = this.usuariosDisponibles().find(u => u.id === d.usuario.id) || null;
    }
    if (d.obraPublica) {
      this.selectedObra = this.obrasDisponibles().find(o => o.idObra === d.obraPublica.idObra) || null;
    }
  }

  eliminar(d: Denuncia): void {
    if (confirm(`¿Eliminar la denuncia "${d.titulo}"?`)) {
      this.denunciaService.delete(d.idDenuncia).subscribe(() => {
        this.denunciaService.actualizarLista();
      });
    }
  }

  // --- BUSQUEDA ---
  buscarPorId(): void {
    const id = this.searchId();
    if (id) {
      this.denunciaService.listId(id).subscribe({
        next: (d) => this.denuncias.set([d]),
        error: () => alert('Denuncia no encontrada')
      });
    } else {
      this.denunciaService.actualizarLista();
    }
  }

  limpiarBusqueda(): void {
    this.searchId.set(null);
    this.denunciaService.actualizarLista();
  }

  // --- DETALLES ---
  verDetalle(d: Denuncia) { this.detalleSeleccionado.set(d); this.detailOpen.set(true); }
  cerrarDetalle() { this.detailOpen.set(false); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.detailOpen()) this.cerrarDetalle(); }
}
