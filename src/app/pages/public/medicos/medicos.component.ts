// src/app/pages/public/medicos/medicos.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-medicos-publico', // Nombre del selector
  standalone: true,
  imports: [],
  template: `
    <div class="container mt-5">
      <h2>Nuestros Médicos</h2>
      <p>Vista pública del staff para que los pacientes conozcan a los profesionales.</p>
    </div>
  `,
  styleUrl: './medicos.component.css' // <-- La ruta relativa dentro de la carpeta es correcta.
})
export class MedicosPublicoComponent { }