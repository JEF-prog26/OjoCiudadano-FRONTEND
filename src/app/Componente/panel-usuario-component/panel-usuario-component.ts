import { Component, HostListener, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';

/* ===== Estados tipados (Roles de Usuario) ===== */
type Rol =
  | 'Ciudadano'
  | 'Moderador'
  | 'Analista'
  | 'Administrador';

const ROLES_PREDEFINIDOS: Rol[] = [
  'Ciudadano',
  'Moderador',
  'Analista',
  'Administrador',
];

/* ===== Interfaces Compartidas ===== */

/** Interfaz para los roles que gestiona el usuario */
interface RolSistema {
  id: number;
  nombre: string; // Ej: ROLE_ADMINISTRADOR
  descripcion?: string;
  fechaCreacion: string; // YYYY-MM-DD
}

/** Interfaz para la gestión de Usuarios */
interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  rol: Rol;
  fechaRegistro: string;
}

@Component({
  selector: 'app-panel-usuario-component',
  imports: [
    CommonModule, FormsModule, HeaderPanelComponent
  ],
  templateUrl: './panel-usuario-component.html',
  styleUrl: './panel-usuario-component.css',
})
export class PanelUsuarioComponent {
  /* Exponer lista de roles al template de Usuario */
  ROLES = ROLES_PREDEFINIDOS;

  /* === ESTADO GENERAL DEL PANEL (Pestaña) === */
  vistaActual = signal<'usuarios' | 'roles'>('usuarios'); // Nuevo: Controla la pestaña activa

  /* === ESTADO DE GESTIÓN DE USUARIOS === */
  usuarios = signal<Usuario[]>([]);
  showFormUsuario = signal(false);
  editingIdUsuario = signal<number | null>(null);
  usuarioForm: Usuario = this.crearUsuarioFormVacio();
  searchIdUsuario = signal<number | null>(null);
  detailOpenUsuario = signal(false);
  detalleSeleccionadoUsuario = signal<Usuario | null>(null);

  /* === ESTADO DE GESTIÓN DE ROLES (NUEVO) === */
  roles = signal<RolSistema[]>([]);
  showFormRol = signal(false);
  editingIdRol = signal<number | null>(null);
  rolForm: RolSistema = this.crearRolFormVacio();
  searchIdRol = signal<number | null>(null);
  detailOpenRol = signal(false);
  detalleSeleccionadoRol = signal<RolSistema | null>(null);

  /* === Computed: Filtrado de usuarios === */
  usuariosFiltrados = computed(() => {
    const search = this.searchIdUsuario();
    const list = this.usuarios();

    if (search === null || search === undefined) {
      return list;
    }
    return list.filter((u) => u.id === search);
  });

  /* === Computed: Filtrado de roles (NUEVO) === */
  rolesFiltrados = computed(() => {
    const search = this.searchIdRol();
    const list = this.roles();

    if (search === null || search === undefined) {
      return list;
    }
    return list.filter((r) => r.id === search);
  });

  constructor(private router: Router) {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    // Datos de ejemplo para Usuarios
    const usuariosData: Usuario[] = [
      { id: 1001, nombres: 'Juan', apellidos: 'Perez', correo: 'juan.p@oc.pe', contrasena: 'hashed', rol: 'Administrador', fechaRegistro: '2024-01-15' },
      { id: 1002, nombres: 'Maria', apellidos: 'Gomez', correo: 'maria.g@oc.pe', contrasena: 'hashed', rol: 'Moderador', fechaRegistro: '2024-02-20' },
      { id: 1003, nombres: 'Carlos', apellidos: 'Rojas', correo: 'carlos.r@ciudadano.pe', contrasena: 'hashed', rol: 'Ciudadano', fechaRegistro: '2024-03-01' },
    ];
    this.usuarios.set(usuariosData);

    // Datos de ejemplo para Roles
    const rolesData: RolSistema[] = [
      { id: 1, nombre: 'ROLE_ADMINISTRADOR', fechaCreacion: '2023-11-01' },
      { id: 2, nombre: 'ROLE_MODERADOR', fechaCreacion: '2023-11-01' },
      { id: 3, nombre: 'ROLE_ANALISTA', fechaCreacion: '2023-11-01' },
      { id: 4, nombre: 'ROLE_CIUDADANO', fechaCreacion: '2023-11-01' },
    ];
    this.roles.set(rolesData);
  }

  /* === Helpers para Formularios === */

  private crearUsuarioFormVacio(): Usuario {
    return { id: 0, nombres: '', apellidos: '', correo: '', contrasena: '', rol: 'Ciudadano', fechaRegistro: '', };
  }

  private crearRolFormVacio(): RolSistema {
    return { id: 0, nombre: '', descripcion: '', fechaCreacion: '' };
  }

  // 🔄 Cambiar entre las pestañas
  cambiarVista(vista: 'usuarios' | 'roles'): void {
    this.vistaActual.set(vista);
    // Limpiar estados de formulario al cambiar de pestaña
    this.showFormUsuario.set(false);
    this.showFormRol.set(false);
    this.detailOpenUsuario.set(false);
    this.detailOpenRol.set(false);
  }


  /* ======================================= */
  /* === CONTROL DE GESTIÓN DE USUARIOS === */
  /* ======================================= */

  goBack(): void {
    this.router.navigateByUrl('/');
  }

  // Control del Formulario
  onRegistrarUsuarioClick(): void {
    this.showFormUsuario.set(true);
    this.editingIdUsuario.set(null);
    this.usuarioForm = this.crearUsuarioFormVacio();
  }

  cancelarFormUsuario(): void {
    this.showFormUsuario.set(false);
    this.editingIdUsuario.set(null);
    this.usuarioForm = this.crearUsuarioFormVacio();
  }

  guardarUsuario(): void {
    if (!this.usuarioForm.nombres || !this.usuarioForm.apellidos || !this.usuarioForm.correo || (!this.editingIdUsuario() && !this.usuarioForm.contrasena)) {
      console.error('ERROR: Completa todos los campos obligatorios (*).');
      return;
    }

    const now = new Date().toISOString().slice(0, 10);

    if (this.editingIdUsuario() === null) {
      // 🆕 CREAR
      const newId = Math.max(...this.usuarios().map(u => u.id), 1000) + 1;
      const nuevoUsuario: Usuario = {
        ... this.usuarioForm,
        id: newId,
        fechaRegistro: now,
        contrasena: 'hashed-' + newId,
      };
      this.usuarios.update(list => [...list, nuevoUsuario]);
      console.log('Usuario registrado:', nuevoUsuario);

    } else {
      // ✏️ EDITAR
      this.usuarios.update(list => {
        const idx = list.findIndex(u => u.id === this.editingIdUsuario());
        if (idx > -1) {
          const usuarioAnterior = list[idx];
          const usuarioActualizado: Usuario = {
            ...usuarioAnterior,
            ...this.usuarioForm,
            id: usuarioAnterior.id,
            fechaRegistro: usuarioAnterior.fechaRegistro,
            contrasena: this.usuarioForm.contrasena ? ('hashed-updated-' + usuarioAnterior.id) : usuarioAnterior.contrasena,
          };
          list[idx] = usuarioActualizado;
        }
        return list;
      });
      console.log('Usuario actualizado:', this.usuarioForm);
    }

    this.showFormUsuario.set(false);
    this.editingIdUsuario.set(null);
    this.usuarioForm = this.crearUsuarioFormVacio();
    this.searchIdUsuario.set(null);
  }

  // Acciones de la Tabla
  buscarPorIdUsuario(): void {
    this.showFormUsuario.set(false);
    if (this.searchIdUsuario() === null || this.searchIdUsuario() === undefined) {
      return;
    }
    if (this.usuariosFiltrados().length === 0) {
      console.warn(`No se encontró ningún usuario con ID ${this.searchIdUsuario()}`);
    }
  }

  limpiarBusquedaUsuario(): void {
    this.searchIdUsuario.set(null);
  }

  editarUsuario(usuario: Usuario): void {
    this.showFormUsuario.set(true);
    this.editingIdUsuario.set(usuario.id);
    this.usuarioForm = { ...usuario, contrasena: '' };
  }

  eliminarUsuario(usuario: Usuario): void {
    // Reemplazar con modal de confirmación
    const ok = window.confirm(
      `¿Seguro que deseas eliminar al usuario con ID ${usuario.id}?`
    );
    if (!ok) return;

    this.usuarios.update(list => list.filter((u) => u.id !== usuario.id));
    this.searchIdUsuario.set(null);

    if (this.detalleSeleccionadoUsuario()?.id === usuario.id) {
      this.cerrarDetalleUsuario();
    }
  }

  verDetalleUsuario(u: Usuario): void {
    this.detalleSeleccionadoUsuario.set(u);
    this.detailOpenUsuario.set(true);
  }

  cerrarDetalleUsuario(): void {
    this.detailOpenUsuario.set(false);
    this.detalleSeleccionadoUsuario.set(null);
  }

  // Clase CSS por rol (Usuarios)
  rolClass(rol?: Rol): string {
    const r = (rol || '').toLowerCase();

    if (r === 'administrador') return 'rol-administrador';
    if (r === 'moderador') return 'rol-moderador';
    if (r === 'analista') return 'rol-analista';
    if (r === 'ciudadano') return 'rol-ciudadano';

    return 'rol-ciudadano';
  }

  /* ==================================== */
  /* === CONTROL DE GESTIÓN DE ROLES === */
  /* ==================================== */

  // Control del Formulario de Roles (NUEVO)
  onRegistrarRolClick(): void {
    this.showFormRol.set(true);
    this.editingIdRol.set(null);
    this.rolForm = this.crearRolFormVacio();
  }

  cancelarFormRol(): void {
    this.showFormRol.set(false);
    this.editingIdRol.set(null);
    this.rolForm = this.crearRolFormVacio();
  }

  guardarRol(): void {
    if (!this.rolForm.nombre) {
      console.error('ERROR: El nombre del rol es obligatorio.');
      return;
    }

    // 🔒 Validación de Formato: Debe empezar con ROLE_ y debe estar en mayúsculas
    const nombreNormalizado = this.rolForm.nombre.toUpperCase();
    if (!nombreNormalizado.startsWith('ROLE_')) {
      console.error('ERROR: El nombre del rol debe seguir el formato ROLE_<NOMBRE>.');
      return;
    }

    const now = new Date().toISOString().slice(0, 10);

    if (this.editingIdRol() === null) {
      // 🆕 CREAR
      const newId = Math.max(...this.roles().map(r => r.id), 0) + 1;
      const nuevoRol: RolSistema = {
        ...this.rolForm,
        id: newId,
        nombre: nombreNormalizado,
        fechaCreacion: now,
      };
      this.roles.update(list => [...list, nuevoRol]);
      console.log('Rol registrado:', nuevoRol);
    } else {
      // ✏️ EDITAR
      this.roles.update(list => {
        const idx = list.findIndex(r => r.id === this.editingIdRol());
        if (idx > -1) {
          const rolAnterior = list[idx];
          const rolActualizado: RolSistema = {
            ...rolAnterior,
            ...this.rolForm,
            nombre: nombreNormalizado,
            id: rolAnterior.id, // Aseguramos no cambiar ID
            fechaCreacion: rolAnterior.fechaCreacion, // Aseguramos no cambiar Fecha
          };
          list[idx] = rolActualizado;
        }
        return list;
      });
      console.log('Rol actualizado:', this.rolForm);
    }

    this.showFormRol.set(false);
    this.editingIdRol.set(null);
    this.rolForm = this.crearRolFormVacio();
    this.searchIdRol.set(null);
  }

  // Acciones de la Tabla de Roles (NUEVO)
  buscarPorIdRol(): void {
    this.showFormRol.set(false);
    if (this.searchIdRol() === null || this.searchIdRol() === undefined) {
      return;
    }
    if (this.rolesFiltrados().length === 0) {
      console.warn(`No se encontró ningún rol con ID ${this.searchIdRol()}`);
    }
  }

  limpiarBusquedaRol(): void {
    this.searchIdRol.set(null);
  }

  editarRol(rol: RolSistema): void {
    this.showFormRol.set(true);
    this.editingIdRol.set(rol.id);
    this.rolForm = { ...rol };
  }

  eliminarRol(rol: RolSistema): void {
    // Reemplazar con modal de confirmación
    const ok = window.confirm(
      `¿Seguro que deseas eliminar el Rol con ID ${rol.id} (${rol.nombre})?`
    );
    if (!ok) return;

    // TODO: En una app real, se debe verificar si este rol está asignado a algún usuario
    this.roles.update(list => list.filter((r) => r.id !== rol.id));
    this.searchIdRol.set(null);

    if (this.detalleSeleccionadoRol()?.id === rol.id) {
      this.cerrarDetalleRol();
    }
  }

  verDetalleRol(r: RolSistema): void {
    this.detalleSeleccionadoRol.set(r);
    this.detailOpenRol.set(true);
  }

  cerrarDetalleRol(): void {
    this.detailOpenRol.set(false);
    this.detalleSeleccionadoRol.set(null);
  }


  // Cerrar modal con ESC (General)
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.detailOpenUsuario()) this.cerrarDetalleUsuario();
    if (this.detailOpenRol()) this.cerrarDetalleRol();
  }
}
