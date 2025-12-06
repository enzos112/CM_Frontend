import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// RUTA CORREGIDA: Subimos tres niveles
import { AuthService } from '../../../core/services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
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
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        // TIPADO CORREGIDO
        next: (response: any) => { 
          this.authService.saveToken(response.token);
          this.router.navigate(['/intranet/dashboard']); 
        },
        // TIPADO CORREGIDO
        error: (error: any) => { 
          this.errorMessage = 'Credenciales incorrectas o error de servidor';
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); 
    }
  }
}