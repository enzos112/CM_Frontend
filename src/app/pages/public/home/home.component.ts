import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mt-5">
      <h1>Bienvenido al Centro Médico Huerta Robles</h1>
      <p class="lead">Portal de atención al paciente y gestión de citas.</p>
      
      <div class="d-grid gap-2 col-6 mx-auto">
        <a routerLink="/agendar-cita" class="btn btn-primary btn-lg">Agendar Cita Ahora</a>
        <a routerLink="/login" class="btn btn-outline-secondary">Acceso a Intranet / Dashboard</a>
      </div>
    </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent { }