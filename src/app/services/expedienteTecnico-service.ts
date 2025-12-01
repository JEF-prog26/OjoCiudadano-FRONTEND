import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ExpedienteTecnico } from '../model/expedienteTecnico';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteTecnicoService {
  // Concatena la base del proyecto + la ruta del controlador
  // Backend: @RequestMapping("/apiOjoCiudadano/expediente-tecnico")
  private url = environment.apiURL + "/expediente-tecnico";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<ExpedienteTecnico[]>();

  constructor() { }

  list(): Observable<any> {
    // Backend: @GetMapping("/listar")
    return this.http.get<ExpedienteTecnico[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    // Backend: @GetMapping("/obtener-por-id/{id}")
    return this.http.get<ExpedienteTecnico>(this.url + "/obtener-por-id/" + id);
  }

  insert(expediente: ExpedienteTecnico): Observable<any> {
    // Backend: @PostMapping("/registrar")
    return this.http.post(this.url + "/registrar", expediente);
  }

  update(expediente: ExpedienteTecnico, id: number): Observable<any> {
    // Backend: @PutMapping("/actualizar/{id}")
    // Aquí pasamos el ID en la URL y el objeto en el cuerpo, tal como configuramos tu backend
    return this.http.put(this.url + "/actualizar/" + id, expediente);
  }

  delete(id: number) {
    // Backend: @DeleteMapping("/eliminar/{id}")
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---

  setList(listaNueva: ExpedienteTecnico[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<ExpedienteTecnico[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de expedientes', err)
    });
  }
}
