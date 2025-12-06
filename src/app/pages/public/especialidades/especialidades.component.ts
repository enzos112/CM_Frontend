import { Component } from '@angular/core';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [],
  template: `
    <div class="container mt-5">
      <h2>Especialidades Médicas</h2>
      <p>Aquí se listarán todas las áreas disponibles para nuestros pacientes.</p>
    </div>
  `,
  styleUrl: './especialidades.component.css'
})
export class EspecialidadesComponent { }