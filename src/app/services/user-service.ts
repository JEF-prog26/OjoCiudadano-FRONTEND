import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Concatena la base del proyecto + la ruta del controlador
  private url = environment.apiURL + "/user";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<User[]>();

  constructor() { }

  list(): Observable<any> {
    return this.http.get<User[]>(this.url + "/listar");
  }

  listId(id: number): Observable<any> {
    return this.http.get<User>(this.url + "/obtener-por-id/" + id);
  }

  insert(user: User): Observable<any> {
    return this.http.post(this.url + "/registrar", user);
  }

  // OJO: Tu backend pide el ID en la URL para actualizar
  update(user: User, id: number): Observable<any> {
    return this.http.put(this.url + "/actualizar/" + id, user);
  }

  delete(id: number) {
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  // --- Metodo especial para asignar Rol a Usuario ---
  // Backend: @PostMapping("/save/{user_id}/{rol_id}")
  insertUserRol(userId: number, roleId: number): Observable<any> {
    return this.http.post(`${this.url}/save/${userId}/${roleId}`, null);
  }

  // --- Lógica de actualización reactiva (Subject) ---
  setList(listaNueva: User[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<User[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.list().subscribe({
      next: (data) => this.setList(data),
      error: (err) => console.error('Error actualizando lista de usuarios', err)
    });
  }
}
