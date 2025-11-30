import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Notificacion } from '../model/notificacion'; // Asegúrate que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  // Concatena la base del proyecto + la ruta del controlador
  private url = environment.apiURL + "/notificacion";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<Notificacion[]>();

  constructor() { }

  list(): Observable<any> {
    return this.http.get<Notificacion[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    return this.http.get<Notificacion>(this.url + "/obtener-por-id/" + id);
  }

  insert(notificacion: Notificacion): Observable<any> {
    return this.http.post(this.url + "/registrar", notificacion);
  }

  // Tu backend pide el ID en la URL para actualizar: @PutMapping("/actualizar/{id}")
  update(notificacion: Notificacion, id: number): Observable<any> {
    return this.http.put(this.url + "/actualizar/" + id, notificacion);
  }

  delete(id: number) {
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---
  setList(listaNueva: Notificacion[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<Notificacion[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de notificaciones', err)
    });
  }
}
