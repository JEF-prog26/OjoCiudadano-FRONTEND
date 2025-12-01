import {Component, HostListener, signal, computed, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';
import { UserService } from '../../services/user-service';
import {RoleService} from '../../services/role-service';
import {User} from '../../model/user';
import {Role} from '../../model/role';

@Component({
  selector: 'app-panel-usuario-component',
  imports: [
    CommonModule, FormsModule, HeaderPanelComponent
  ],
  templateUrl: './panel-usuario-component.html',
  styleUrl: './panel-usuario-component.css',
})
export class PanelUsuarioComponent implements OnInit {
  // Servicios
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private router = inject(Router);

  // === ESTADO GENERAL DEL PANEL ===
  vistaActual = signal<'usuarios' | 'roles'>('usuarios');

  // === ESTADO DE GESTIÓN DE USUARIOS ===
  usuarios = signal<User[]>([]);
  showFormUsuario = signal(false);
  editingIdUsuario = signal<number | null>(null);
  usuarioForm: User = new User(); // Usamos la clase del Modelo
  searchIdUsuario = signal<number | null>(null);
  detailOpenUsuario = signal(false);
  detalleSeleccionadoUsuario = signal<User | null>(null);

  // === ESTADO DE GESTIÓN DE ROLES ===
  roles = signal<Role[]>([]); // Lista de roles traída de BD
  showFormRol = signal(false);
  editingIdRol = signal<number | null>(null);
  rolForm: Role = new Role();
  searchIdRol = signal<number | null>(null);
  detailOpenRol = signal(false);
  detalleSeleccionadoRol = signal<Role | null>(null);

  // Rol seleccionado temporalmente en el formulario de usuario
  selectedRoleForUser: Role | null = null;

  /* === Computed: Filtrado de usuarios === */
  usuariosFiltrados = computed(() => {
    const search = this.searchIdUsuario();
    const list = this.usuarios();
    if (!search) return list;
    return list.filter((u) => u.id === search);
  });

  /* === Computed: Filtrado de roles === */
  rolesFiltrados = computed(() => {
    const search = this.searchIdRol();
    const list = this.roles();
    if (!search) return list;
    return list.filter((r) => r.id === search);
  });

  constructor() {}

  ngOnInit(): void {
    // 1. Cargar listas iniciales
    this.userService.list().subscribe(data => this.usuarios.set(data));
    this.roleService.list().subscribe(data => this.roles.set(data));

    // 2. Suscribirse a cambios (Lógica del Profesor para actualizar tablas)
    this.userService.getListaCambio().subscribe(data => this.usuarios.set(data));
    this.roleService.getListaCambio().subscribe(data => this.roles.set(data));
  }

  // 🔄 Cambiar entre pestañas
  cambiarVista(vista: 'usuarios' | 'roles'): void {
    this.vistaActual.set(vista);
    this.cancelarFormUsuario();
    this.cancelarFormRol();
  }

  /* ======================================= */
  /* === GESTIÓN DE USUARIOS (BACKEND) === */
  /* ======================================= */

  onRegistrarUsuarioClick(): void {
    this.showFormUsuario.set(true);
    this.editingIdUsuario.set(null);
    this.usuarioForm = new User();
    this.selectedRoleForUser = null;
  }

  cancelarFormUsuario(): void {
    this.showFormUsuario.set(false);
    this.editingIdUsuario.set(null);
    this.usuarioForm = new User();
  }

  guardarUsuario(): void {
    // Validaciones básicas
    if (!this.usuarioForm.nombre || !this.usuarioForm.apellido || !this.usuarioForm.username) {
      alert('Complete los campos obligatorios');
      return;
    }

    // Asignar el rol seleccionado al usuario (User tiene roles[])
    if (this.selectedRoleForUser) {
      this.usuarioForm.roles = [this.selectedRoleForUser];
    }

    if (this.editingIdUsuario() === null) {
      // CREAR (POST)
      this.userService.insert(this.usuarioForm).subscribe(() => {
        this.userService.actualizarLista(); // Pide la lista nueva al backend
        this.showFormUsuario.set(false);
        alert('Usuario registrado correctamente');
      });
    } else {
      // EDITAR (PUT)
      // Ojo: pasamos el usuario y su ID
      this.userService.update(this.usuarioForm, this.usuarioForm.id).subscribe(() => {
        this.userService.actualizarLista();
        this.showFormUsuario.set(false);
        alert('Usuario actualizado correctamente');
      });
    }
  }

  editarUsuario(usuario: User): void {
    this.showFormUsuario.set(true);
    this.editingIdUsuario.set(usuario.id);
    this.usuarioForm = { ...usuario }; // Clonamos para no editar directo en tabla
    // Pre-seleccionar el rol en el combo (si tiene uno)
    if (usuario.roles && usuario.roles.length > 0) {
      // Buscamos el objeto rol completo en la lista de roles que coincida con el ID
      this.selectedRoleForUser = this.roles().find(r => r.id === usuario.roles[0].id) || null;
    }
  }

  eliminarUsuario(usuario: User): void {
    if (confirm(`¿Eliminar usuario ${usuario.username}?`)) {
      this.userService.delete(usuario.id).subscribe(() => {
        this.userService.actualizarLista();
      });
    }
  }

  buscarPorIdUsuario(): void {
    const id = this.searchIdUsuario();
    if (id) {
      this.userService.listId(id).subscribe({
        next: (u) => {
          // Si el backend devuelve un solo objeto, lo metemos en un array para mostrarlo
          this.usuarios.set([u]);
        },
        error: () => alert('Usuario no encontrado')
      });
    } else {
      this.userService.actualizarLista(); // Si está vacío, recarga todos
    }
  }

  limpiarBusquedaUsuario(): void {
    this.searchIdUsuario.set(null);
    this.userService.actualizarLista();
  }

  // Modales Usuario
  verDetalleUsuario(u: User) { this.detalleSeleccionadoUsuario.set(u); this.detailOpenUsuario.set(true); }
  cerrarDetalleUsuario() { this.detailOpenUsuario.set(false); }


  /* ==================================== */
  /* === GESTIÓN DE ROLES (BACKEND) === */
  /* ==================================== */

  onRegistrarRolClick(): void {
    this.showFormRol.set(true);
    this.editingIdRol.set(null);
    this.rolForm = new Role();
  }

  cancelarFormRol(): void {
    this.showFormRol.set(false);
    this.editingIdRol.set(null);
  }

  guardarRol(): void {
    if (!this.rolForm.name) {
      alert('El nombre del rol es obligatorio');
      return;
    }
    // Forzamos mayúsculas si quieres
    this.rolForm.name = this.rolForm.name.toUpperCase();

    if (this.editingIdRol() === null) {
      // CREAR
      this.roleService.insert(this.rolForm).subscribe(() => {
        this.roleService.actualizarLista();
        this.showFormRol.set(false);
      });
    } else {
      // EDITAR
      this.roleService.update(this.rolForm).subscribe(() => {
        this.roleService.actualizarLista();
        this.showFormRol.set(false);
      });
    }
  }

  editarRol(rol: Role): void {
    this.showFormRol.set(true);
    this.editingIdRol.set(rol.id);
    this.rolForm = { ...rol };
  }

  eliminarRol(rol: Role): void {
    if (confirm(`¿Eliminar rol ${rol.name}?`)) {
      this.roleService.delete(rol.id).subscribe(() => {
        this.roleService.actualizarLista();
      });
    }
  }

  buscarPorIdRol(): void {
    const id = this.searchIdRol();
    if (id) {
      this.roleService.listId(id).subscribe({
        next: (r) => this.roles.set([r]),
        error: () => alert('Rol no encontrado')
      });
    } else {
      this.roleService.actualizarLista();
    }
  }

  limpiarBusquedaRol(): void { this.searchIdRol.set(null); this.roleService.actualizarLista(); }

  // Modales Rol
  verDetalleRol(r: Role) { this.detalleSeleccionadoRol.set(r); this.detailOpenRol.set(true); }
  cerrarDetalleRol() { this.detailOpenRol.set(false); }

  // Helpers visuales
  rolClass(rolNombre?: string): string {
    const r = (rolNombre || '').toLowerCase();
    if (r.includes('admin')) return 'rol-administrador';
    if (r.includes('ciudadano')) return 'rol-ciudadano';
    if (r.includes('desarrollador')) return 'rol-analista';
    return 'rol-moderador';
  }

  // Obtenemos el nombre del primer rol para mostrar en tabla
  getRoleName(u: User): string {
    return u.roles && u.roles.length > 0 ? u.roles[0].name : 'Sin Rol';
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.detailOpenUsuario()) this.cerrarDetalleUsuario();
    if (this.detailOpenRol()) this.cerrarDetalleRol();
  }
}
