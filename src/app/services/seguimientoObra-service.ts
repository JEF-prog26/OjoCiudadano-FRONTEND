import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { SeguimientoObra } from '../model/seguimientoObra';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoObraService {
  // Concatena la base del proyecto + la ruta del controlador
  // Backend: @RequestMapping("/apiOjoCiudadano/seguimiento-obra")
  private url = environment.apiURL + "/seguimiento-obra";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<SeguimientoObra[]>();

  constructor() { }

  list(): Observable<any> {
    // Backend: @GetMapping("/listar")
    return this.http.get<SeguimientoObra[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    // Backend: @GetMapping("/obtener-por-id/{id}")
    return this.http.get<SeguimientoObra>(this.url + "/obtener-por-id/" + id);
  }

  insert(seguimiento: SeguimientoObra): Observable<any> {
    return this.http.post(this.url + "/registrar", seguimiento);
  }

  update(seguimiento: SeguimientoObra, id: number): Observable<any> {
    // Backend: @PutMapping("/actualizar/{id}")
    // Pasamos el ID en la URL y el objeto completo en el cuerpo
    return this.http.put(this.url + "/actualizar/" + id, seguimiento);
  }

  delete(id: number) {
    // Backend: @DeleteMapping("/eliminar/{id}")
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---

  setList(listaNueva: SeguimientoObra[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<SeguimientoObra[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de seguimientos', err)
    });
  }
}
