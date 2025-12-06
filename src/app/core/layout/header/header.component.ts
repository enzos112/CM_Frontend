import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" routerLink="/">
          CMHR 🏥
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/especialidades" routerLinkActive="active">Especialidades</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/medicos" routerLinkActive="active">Médicos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/citas" routerLinkActive="active">Servicios</a>
            </li>
          </ul>
          
          <div class="d-flex">
            <a routerLink="/intranet/agendar-cita" class="btn btn-success me-2">Agendar Cita</a>
            
            <a routerLink="/login" class="btn btn-outline-light">Acceder</a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrl: './header.component.css' // Crea un archivo CSS vacío aquí
})
export class HeaderComponent {
  // Aquí podemos recibir información de sesión si es necesario
}