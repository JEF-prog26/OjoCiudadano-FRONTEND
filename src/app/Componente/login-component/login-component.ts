import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LoginService} from '../../services/login-service';
import {RequestDto} from '../../model/request-dto';
import {ResponseDto} from '../../model/response-dto';

@Component({
  selector: 'app-login-component',
  imports: [RouterLink,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit{
  // 1. Definimos las variables igual que el profesor
  loginForm: FormGroup;
  router: Router = inject(Router);
  fb = inject(FormBuilder);
  loginService: LoginService = inject(LoginService);

  constructor() {
    // 2. Creamos el formulario con validaciones
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]], // Agregué validación de email por seguridad
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    // 3. Limpieza de token al entrar
    if (localStorage.getItem('token') != null) {
      localStorage.clear();
      console.log("Token y items eliminados por seguridad");
    }
  }

  onSubmit() {
    // 4. Lógica de envío al Backend
    if (this.loginForm.valid) {
      const requestDto: RequestDto = new RequestDto();
      requestDto.username = this.loginForm.value.username;
      requestDto.password = this.loginForm.value.password;

      this.loginService.login(requestDto).subscribe({
        next: (data: ResponseDto): void => {
          console.log("Login exitoso. Roles:", data.roles);
          // Guardamos el token y el rol (asumiendo que tu servicio guarda el token internamente o lo agregas aquí)
          // localStorage.setItem('token', data.token); // Descomentar si tu servicio no lo hace
          localStorage.setItem('rol', data.roles[0]);

          alert("Login correcto!");
          this.router.navigate(['/dashboard']); // O '/dashboard' según tu ruta real
        },
        error: (error: any) => {
          console.error(error);
          alert("Error de credenciales"); // Feedback para el usuario
        }
      });
    } else {
      alert("Por favor complete los campos requeridos");
      this.loginForm.markAllAsTouched(); // Para que se pongan rojos si faltan datos
    }
  }
}
