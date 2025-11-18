import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet'; // Importamos Leaflet


/* Interfaz de Obra */
interface Obra {
  id: number;
  nombre: string;
  fechaInicio: string;
  estado: 'Activo' | 'Detenido' | 'Finalizado';
  activo: boolean;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-panel-seguimiento-obra-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-seguimiento-obra-component.html', // Ruta correcta
  styleUrl: './panel-seguimiento-obra-component.css',
})
export class PanelSeguimientoObraComponent implements OnInit, AfterViewInit { // Clase correcta

  obras: Obra[] = [
    { id: 1478532496, nombre: 'Mejoramiento Av. Tacna', fechaInicio: '2023-08-17', estado: 'Activo', activo: true, lat: -12.046374, lng: -77.042793 },
    { id: 2233445566, nombre: 'Parque de la Reserva', fechaInicio: '2024-01-10', estado: 'Detenido', activo: false, lat: -12.070778, lng: -77.035306 },
  ];
  obraSeleccionada: Obra = this.crearObraVacia();
  private map: any;
  private markers: L.Marker[] = [];
  searchId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  private initMap(): void {
    try {
      this.map = L.map('map').setView([-12.046374, -77.042793], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
      this.actualizarMarcadores();
    } catch (e) {
      console.error("Error al iniciar el mapa", e);
    }
  }

  private actualizarMarcadores(): void {
    if (!this.map) return;
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
    this.obras.forEach(obra => {
      const marker = L.marker([obra.lat, obra.lng])
        .addTo(this.map)
        .bindPopup(`<b>${obra.nombre}</b><br>${obra.estado}`);
      marker.on('click', () => {
        this.seleccionarObra(obra);
      });
      this.markers.push(marker);
    });
  }

  private crearObraVacia(): Obra {
    return {
      id: 0,
      nombre: '',
      fechaInicio: new Date().toISOString().slice(0, 10),
      estado: 'Activo',
      activo: true,
      lat: -12.046374,
      lng: -77.042793
    };
  }

  seleccionarObra(obra: Obra): void {
    this.obraSeleccionada = { ...obra };
    if (this.map) {
      this.map.setView([obra.lat, obra.lng], 15);
    }
  }

  // 🆕 PEGUE TODA ESTA FUNCIÓN
  buscarPorId(): void {
    if (this.searchId === null || this.searchId === undefined) {
      alert("Por favor, ingrese un ID en la barra de búsqueda.");
      return;
    }

    // 1. Buscar la obra en el array 'obras'
    const obraEncontrada = this.obras.find(o => o.id === this.searchId);

    if (obraEncontrada) {
      // 2. Si se encuentra, la seleccionamos (esto mueve el mapa)
      this.seleccionarObra(obraEncontrada);

      // 3. Abrir el popup del marcador
      const marker = this.markers.find(m => {
        const latLng = m.getLatLng();
        return latLng.lat === obraEncontrada.lat && latLng.lng === obraEncontrada.lng;
      });
      if (marker) {
        marker.openPopup();
      }

    } else {
      // 4. Si no se encuentra
      alert(`Obra no encontrada.\nNo existe ninguna obra con el ID ${this.searchId}.`);
    }

    // 5. Limpiar el input de búsqueda
    this.searchId = null;
  }

  registrar(): void {
    if (!this.obraSeleccionada.nombre) {
      alert("Ingrese nombre de la obra"); return;
    }

    // Si el ID es 0, es un NUEVO registro
    if (this.obraSeleccionada.id === 0) {

      // Calcular el nuevo ID
      let nuevoId = 1;
      if (this.obras.length > 0) {
        // Busca el ID más alto actual y le suma 1
        const maxId = Math.max(...this.obras.map(o => o.id));
        nuevoId = maxId + 1;
      }

      this.obraSeleccionada.id = nuevoId;
      this.obras.push({ ...this.obraSeleccionada });

    } else {
      // Si ya tiene ID (no es 0), es una actualización
      this.actualizar();
      return;
    }
    this.actualizarMarcadores();
    this.limpiar();
  }

  eliminar(): void {
    if (this.obraSeleccionada.id === 0) return;
    this.obras = this.obras.filter(o => o.id !== this.obraSeleccionada.id);
    this.actualizarMarcadores();
    this.limpiar();
  }

  actualizar(): void {
    if (this.obraSeleccionada.id === 0) return;
    const index = this.obras.findIndex(o => o.id === this.obraSeleccionada.id);
    if (index !== -1) {
      this.obras[index] = { ...this.obraSeleccionada };
      this.actualizarMarcadores();
      alert('Obra actualizada');
    }
  }

  listar(): void {
    this.obraSeleccionada = this.crearObraVacia();
    if (this.map) {
      this.map.setView([-12.046374, -77.042793], 13);
    }
  }

  limpiar(): void {
    this.obraSeleccionada = this.crearObraVacia();
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }
}
