import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  // Datos simulados del usuario (esto vendría de tu AuthService o Backend)
  usuario = {
    nombre: 'Dr. Alejandro Huerta',
    iniciales: 'AH',
    especialidad: 'Cardiología',
    correo: 'alejandro.huerta@huertarobles.com',
    titulo: 'Cardiólogo Clínico e Intervencionista',
    cmp: '12345', // Código médico
    rne: '67890'  // Registro nacional de especialista
  };
}