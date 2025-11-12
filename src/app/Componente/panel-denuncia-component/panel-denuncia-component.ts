import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Denuncia {
  id: number;
  titulo: string;
  descripcion: string;
  fechaDenuncia: string;
  estado: string;
}

@Component({
  selector: 'app-panel-denuncia-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-denuncia-component.html',
  styleUrl: './panel-denuncia-component.css',
})
export class PanelDenunciaComponent {

  showForm = false;
  editingId: number | null = null; // null = creando, != null = editando

  denunciaForm: Denuncia = this.crearFormVacio();
  denuncias: Denuncia[] = [];
  denunciasFiltradas: Denuncia[] = [];

  // 🔍 valor del buscador por ID
  searchId: number | null = null;

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
      estado: '',
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

    if (this.editingId === null) {
      // CREAR
      const existe = this.denuncias.some(d => d.id === this.denunciaForm.id);
      if (existe) {
        alert('Ya existe una denuncia con ese ID.');
        return;
      }
      this.denuncias.push({ ...this.denunciaForm });
    } else {
      // EDITAR
      const idx = this.denuncias.findIndex(d => d.id === this.editingId);
      if (idx > -1) {
        this.denuncias[idx] = { ...this.denunciaForm };
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
      d => d.id === this.searchId
    );

    if (this.denunciasFiltradas.length === 0) {
      alert('No se encontró ninguna denuncia con ese ID.');
    }
  }

  limpiarBusqueda(): void {
    this.searchId = null;
    this.denunciasFiltradas = [...this.denuncias];
  }

  // EDITAR DESDE LA TABLA
  editarDenuncia(denuncia: Denuncia): void {
    this.showForm = true;
    this.editingId = denuncia.id;
    this.denunciaForm = { ...denuncia };
  }

  // ELIMINAR DESDE LA TABLA
  eliminarDenuncia(denuncia: Denuncia): void {
    const ok = confirm(`¿Seguro que deseas eliminar la denuncia con ID ${denuncia.id}?`);
    if (!ok) return;

    this.denuncias = this.denuncias.filter(d => d.id !== denuncia.id);
    this.denunciasFiltradas = [...this.denuncias];
    this.searchId = null;
  }
}
