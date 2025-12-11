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
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string = '';
  showPassword = false;

  // Regex estricto para email
  private readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      // EMAIL: Estricto (Requerido + Regex)
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]], 
      
      // PASSWORD: Relajado (Solo Requerido, aceptamos '123')
      password: ['', [Validators.required]] 
    });
  }

  // Getter para facilitar el acceso en el HTML (f.email, f.password)
  get f() { return this.loginForm.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        const usuarioActual = this.authService.getUser();
        
        // Redirección inteligente
        if (usuarioActual?.role === 'ADMIN' || usuarioActual?.role === 'MEDICO') {
          this.router.navigate(['/intranet/dashboard']);
        } else {
          this.router.navigate(['/']); // Home para pacientes
        }
        
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error en Login:', err);
        this.loading = false;
        
        // Manejo de errores 401/403 vs 500
        if (err.status === 401 || err.status === 403) {
            this.errorMessage = 'Credenciales incorrectas. Verifique su email y contraseña.';
        } else {
            this.errorMessage = 'Error de conexión con el servidor.';
        }
      }
    });
  }
}