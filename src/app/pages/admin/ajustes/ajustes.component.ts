import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para los toggles (ngModel)

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesComponent {
  // Estado inicial de las configuraciones (según la imagen)
  config = {
    resumenDiario: true,
    alertasCancelacion: false
  };

  guardarPreferencias() {
    console.log('Guardando preferencias:', this.config);
    // Aquí llamarías a tu servicio para guardar en el backend
    alert('Preferencias guardadas correctamente');
  }
}