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
    // CAMBIO IMPORTANTE: Cambié 'email' por 'documento' según el diseño visual
    this.loginForm = this.fb.group({
      documento: ['', [Validators.required]], // Quitamos Validators.email si es un DNI/RUC
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => { 
          this.authService.saveToken(response.token);
          this.router.navigate(['/intranet/dashboard']); 
        },
        error: (error: any) => { 
          // Manejo de error más amigable
          this.errorMessage = 'Credenciales incorrectas. Verifique su documento y contraseña.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); 
    }
  }
}