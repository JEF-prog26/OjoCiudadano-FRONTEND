import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Evidencia } from '../model/evidencia';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {
  // Concatena la base del proyecto + la ruta del controlador
  private url = environment.apiURL + "/evidencia";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<Evidencia[]>();

  constructor() { }

  list(): Observable<any> {
    // Backend: @GetMapping("/listar")
    return this.http.get<Evidencia[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    // Backend: @GetMapping("/obtener-por-id/{id}")
    return this.http.get<Evidencia>(this.url + "/obtener-por-id/" + id);
  }

  insert(evidencia: Evidencia): Observable<any> {
    // Backend: @PostMapping("/registrar")
    return this.http.post(this.url + "/registrar", evidencia);
  }

  update(evidencia: Evidencia, id: number): Observable<any> {
    // Backend: @PutMapping("/actualizar/{id}")
    // Pasamos el ID en la URL y el objeto en el cuerpo
    return this.http.put(this.url + "/actualizar/" + id, evidencia);
  }

  delete(id: number) {
    // Backend: @DeleteMapping("/eliminar/{id}")
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---

  setList(listaNueva: Evidencia[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<Evidencia[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de evidencias', err)
    });
  }
}
