import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { GobiernoRegional } from '../model/gobiernoRegional';

@Injectable({
  providedIn: 'root'
})
export class GobiernoRegionalService {
  // Concatena la base del proyecto + la ruta del controlador
  // Backend: @RequestMapping("/apiOjoCiudadano/gobierno-regional")
  private url = environment.apiURL + "/gobierno-regional";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<GobiernoRegional[]>();

  constructor() { }

  list(): Observable<any> {
    // Backend: @GetMapping("/listar")
    return this.http.get<GobiernoRegional[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    // Backend: @GetMapping("/obtener-por-id/{id}")
    return this.http.get<GobiernoRegional>(this.url + "/obtener-por-id/" + id);
  }

  insert(gobierno: GobiernoRegional): Observable<any> {
    // Backend: @PostMapping("/registrar")
    return this.http.post(this.url + "/registrar", gobierno);
  }

  update(gobierno: GobiernoRegional, id: number): Observable<any> {
    // Backend: @PutMapping("/actualizar/{id}")
    // Pasamos el ID en la URL y el objeto en el cuerpo, coincidiendo con tu controller actualizado
    return this.http.put(this.url + "/actualizar/" + id, gobierno);
  }

  delete(id: number) {
    // Backend: @DeleteMapping("/eliminar/{id}")
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---

  setList(listaNueva: GobiernoRegional[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<GobiernoRegional[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de Gobiernos Regionales', err)
    });
  }
}
