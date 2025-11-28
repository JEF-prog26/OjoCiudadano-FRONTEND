import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Role } from '../model/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // Concatena la base del proyecto + la ruta del controlador
  private url = environment.apiURL + "/role";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<Role[]>();

  constructor() { }

  list(): Observable<any> {
    // Tu backend dice @GetMapping("/Listar")
    return this.http.get<Role[]>(this.url + "/Listar");
  }

  listId(id: number): Observable<any> {
    return this.http.get<Role[]>(this.url + "/obtener-por-id/" + id);
  }

  insert(role: Role): Observable<any> {
    return this.http.post(this.url + "/registrar", role);
  }

  update(role: Role): Observable<any> {
    // Tu backend dice @PutMapping("/actualizar") y recibe el objeto en el body
    return this.http.put(this.url + "/actualizar", role);
  }

  delete(id: number) {
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Lógica de actualización reactiva (Subject) ---
  setList(listaNueva: Role[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<Role[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de roles', err)
    });
  }
}
