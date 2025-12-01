import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AvanceObra } from '../model/avanceObra';

@Injectable({
  providedIn: 'root'
})
export class AvanceObraService {
  // Concatena la base del proyecto + la ruta del controlador
  // Backend: @RequestMapping("/apiOjoCiudadano/avance-obra")
  private url = environment.apiURL + "/avance-obra";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<AvanceObra[]>();

  constructor() { }

  list(): Observable<any> {
    // Backend: @GetMapping("/listar")
    return this.http.get<AvanceObra[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    // Backend: @GetMapping("/obtener-por-id/{id}")
    return this.http.get<AvanceObra>(this.url + "/obtener-por-id/" + id);
  }

  insert(avanceObra: AvanceObra): Observable<any> {
    // Backend: @PostMapping("/registrar")
    return this.http.post(this.url + "/registrar", avanceObra);
  }

  update(avanceObra: AvanceObra, id: number): Observable<any> {
    // Backend: @PutMapping("/actualizar/{id}")
    // Pasamos el ID en la URL y el objeto completo en el cuerpo
    return this.http.put(this.url + "/actualizar/" + id, avanceObra);
  }

  delete(id: number) {
    // Backend: @DeleteMapping("/eliminar/{id}")
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---

  setList(listaNueva: AvanceObra[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<AvanceObra[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de avances de obra', err)
    });
  }
}
