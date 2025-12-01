import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Denuncia } from '../model/denuncia';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  // Concatena la base del proyecto + la ruta del controlador
  // Backend: @RequestMapping("/apiOjoCiudadano/denuncia")
  private url = environment.apiURL + "/denuncia";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<Denuncia[]>();

  constructor() { }

  list(): Observable<any> {
    // Backend: @GetMapping("/listar")
    return this.http.get<Denuncia[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    // Backend: @GetMapping("/obtener-por-id/{id}")
    return this.http.get<Denuncia>(this.url + "/obtener-por-id/" + id);
  }

  insert(denuncia: Denuncia): Observable<any> {
    // Backend: @PostMapping("/registar")  <-- OJO: Está escrito así en tu Controller
    return this.http.post(this.url + "/registar", denuncia);
  }

  update(denuncia: Denuncia, id: number): Observable<any> {
    // Backend: @PutMapping("/actualizar/{id}")
    // Pasamos el ID en la URL y el objeto en el cuerpo
    return this.http.put(this.url + "/actualizar/" + id, denuncia);
  }

  delete(id: number) {
    // Backend: @DeleteMapping("/eliminar/{id}")
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---

  setList(listaNueva: Denuncia[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<Denuncia[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de denuncias', err)
    });
  }
}
