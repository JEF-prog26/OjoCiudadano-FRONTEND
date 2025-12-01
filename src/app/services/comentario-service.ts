import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Comentario } from '../model/comentario'; // Asegúrate de la ruta

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  // Concatena la base del proyecto + la ruta del controlador
  // Backend: @RequestMapping("/apiOjoCiudadano/comentario")
  private url = environment.apiURL + "/comentario";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<Comentario[]>();

  constructor() { }

  list(): Observable<any> {
    // Backend: @GetMapping("/listar")
    return this.http.get<Comentario[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    // Backend: @GetMapping("/obtener-por-id/{id}")
    return this.http.get<Comentario>(this.url + "/obtener-por-id/" + id);
  }

  insert(comentario: Comentario): Observable<any> {
    // Backend: @PostMapping("/registar") <--- OJO: Está así en tu controller (typo)
    return this.http.post(this.url + "/registrar", comentario);
  }

  update(comentario: Comentario, id: number): Observable<any> {
    // Backend: @PutMapping("/actualizar/{id}")
    // Pasamos el ID en la URL y el objeto completo en el cuerpo
    return this.http.put(this.url + "/actualizar/" + id, comentario);
  }

  delete(id: number) {
    // Backend: @DeleteMapping("/eliminar/{id}")
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---

  setList(listaNueva: Comentario[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<Comentario[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de comentarios', err)
    });
  }
}
