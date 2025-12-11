import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corregido: styleUrl -> styleUrls (plural)
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false; // Agregado para deshabilitar botón mientras carga
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      alert('❌ Formulario inválido. Revisa los campos.');
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const credentials = this.loginForm.value;

    console.log('🔵 1. Enviando credenciales al Backend:', credentials);
    alert('🔵 1. Enviando petición de Login...');

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        console.log('🟢 2. Respuesta del Backend recibida:', response);
        alert('🟢 2. ¡Login Exitoso! Token recibido.');

        // El AuthService ya guardó el token y actualizó el userSubject en el método login()
        // Ahora verificamos si el usuario se actualizó correctamente
        const usuarioActual = this.authService.getUser();
        console.log('🟢 3. Usuario en AuthService:', usuarioActual);
        
        if (usuarioActual) {
          alert(`🟢 3. Usuario detectado: ${usuarioActual.sub} (${usuarioActual.role}). Redirigiendo...`);
          
          // Lógica de redirección basada en roles
          if (usuarioActual.role === 'ADMIN' || usuarioActual.role === 'MEDICO') {
            this.router.navigate(['/intranet/dashboard']);
          } else {
            this.router.navigate(['/']); // Home para pacientes
          }
        } else {
          alert('⚠️ 3. ¡ALERTA! El token llegó pero AuthService.getUser() devolvió null. Revisa decodeToken en AuthService.');
          // Aún así redirigimos al home por si acaso
          this.router.navigate(['/']);
        }
        
        this.loading = false;
      },
      error: (err: any) => {
        console.error('🔴 Error en Login:', err);
        this.loading = false;
        this.errorMessage = 'Credenciales incorrectas o error de servidor.';
        
        // Mostrar mensaje técnico en alerta para debug
        const serverMsg = err.error?.message || err.statusText || 'Error desconocido';
        alert('🔴 Error en Login: ' + serverMsg);
      }
    });
  }
}