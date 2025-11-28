import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UserService} from '../../services/user-service';
import {User} from '../../model/user';

@Component({
  selector: 'app-registrar-usuario-component',
  imports: [RouterLink,
    ReactiveFormsModule, // Necesario para formGroup
    CommonModule         // Necesario para validaciones visuales
  ],
  templateUrl: './registrar-usuario-component.html',
  styleUrl: './registrar-usuario-component.css',
})
export class RegistrarUsuarioComponent implements OnInit {
  form: FormGroup;
  id: number = 0;
  edicion: boolean = false; // Bandera para saber si editamos o creamos

  // Inyecciones (Estilo moderno de Angular)
  userService: UserService = inject(UserService);
  formBuilder: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    // Definimos el formulario para que coincida con tu Modelo User
    this.form = this.formBuilder.group({
      id: [0],
      nombre: ['', Validators.required],   // Ojo: nombre (singular)
      apellido: ['', Validators.required], // Ojo: apellido (singular)
      username: ['', [Validators.required, Validators.email]], // username es el correo
      password: ['', Validators.required],
      // fechaRegistro y roles se manejan internamente o por defecto
    });
  }

  ngOnInit(): void {
    // Verificamos si hay un ID en la URL (Lógica de Editar)
    this.route.params.subscribe((data: Params) => {
      this.id = data['id']; // Captura el número de la URL
      this.edicion = data['id'] != null;

      if (this.edicion) {
        this.init(); // Si es edición, cargamos los datos
      }
    });
  }

  // Carga los datos del usuario si estamos editando
  init() {
    this.userService.listId(this.id).subscribe((data) => {
      this.form.patchValue({
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        username: data.username,
        // La contraseña NO se carga por seguridad, se deja vacía para que el usuario decida si cambiarla
      });
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      // Convertimos el formulario a objeto User
      const user: User = new User();
      user.id = this.id;
      user.nombre = this.form.value.nombre;
      user.apellido = this.form.value.apellido;
      user.username = this.form.value.username;
      user.password = this.form.value.password;
      // user.roles = []; // El backend o una segunda llamada asignará el rol por defecto

      if (this.edicion) {
        // Lógica de ACTUALIZAR
        // Nota: Si el password está vacío en edición, tu backend debe manejarlo (como vimos antes)
        this.userService.update(user, this.id).subscribe(() => {
          this.userService.actualizarLista();
          alert('Usuario actualizado correctamente');
          this.router.navigate(['/login']); // O a donde quieras ir
        });
      } else {
        // Lógica de REGISTRAR (NUEVO)
        this.userService.insert(user).subscribe(() => {
          this.userService.actualizarLista();

          // OJO: Aquí podrías llamar a insertUserRol si quieres asignar un rol automático
          // Por ahora solo crea el usuario.
          alert('Cuenta creada correctamente');
          this.router.navigate(['/login']);
        });
      }
    } else {
      alert('Por favor complete todos los campos obligatorios.');
    }
  }
}
