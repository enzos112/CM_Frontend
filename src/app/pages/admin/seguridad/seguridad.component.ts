import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.css']
})
export class SeguridadComponent {
  
  cambiarPassword() {
    // Aquí podrías abrir un Modal o redirigir a un formulario
    alert('Se enviará un correo para restablecer la contraseña.');
  }
}