import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Inversion } from '../model/inversion'; // Asegúrate de la ruta

@Injectable({
  providedIn: 'root'
})
export class InversionService {
  // Concatena la base del proyecto + la ruta del controlador
  // Backend: @RequestMapping("/apiOjoCiudadano/inversion")
  private url = environment.apiURL + "/inversion";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<Inversion[]>();

  constructor() { }

  list(): Observable<any> {
    // Backend: @GetMapping("/listar")
    return this.http.get<Inversion[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    // Backend: @GetMapping("/obtener-por-id/{id}")
    return this.http.get<Inversion>(this.url + "/obtener-por-id/" + id);
  }

  insert(inversion: Inversion): Observable<any> {
    // Backend: @PostMapping("/registrar")
    return this.http.post(this.url + "/registrar", inversion);
  }

  update(inversion: Inversion, id: number): Observable<any> {
    // Backend: @PutMapping("/actualizar/{id}")
    // Pasamos el ID en la URL y el objeto completo en el cuerpo
    return this.http.put(this.url + "/actualizar/" + id, inversion);
  }

  delete(id: number) {
    // Backend: @DeleteMapping("/eliminar/{id}")
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---

  setList(listaNueva: Inversion[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<Inversion[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de inversiones', err)
    });
  }
}
