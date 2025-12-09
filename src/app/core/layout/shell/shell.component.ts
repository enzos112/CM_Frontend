import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <!-- Header para páginas dentro del shell -->
    <header class="bg-white shadow-sm">
      <nav class="container navbar navbar-expand-lg navbar-light">
        <div class="navbar-brand d-flex align-items-center">
          <i class="bi bi-hospital me-2 text-primary fs-4"></i>
          <span class="fw-bold text-dark">Centro Médico Huerta Robles</span>
        </div>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link text-dark" href="#">Nosotros</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" routerLink="/app/especialidades">Especialidades</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" routerLink="/app/medicos">Médicos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="#">Blog</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="#">Contacto</a>
            </li>
          </ul>
        </div>

        <div class="d-flex align-items-center">
          <a class="nav-link text-dark me-3" routerLink="/login">Iniciar sesión</a>
          <a class="btn btn-outline-secondary me-2" routerLink="/register">Registrarme</a>
          <a class="btn btn-primary" routerLink="/app/intranet/agendar-cita">Agendar Cita</a>
        </div>
      </nav>
    </header>

    <main class="content-wrapper">
      <router-outlet></router-outlet>
    </main>

    <footer class="footer bg-light mt-auto py-3 border-top">
      <div class="container text-center">
        <span class="text-muted">© 2025 CMHR - Centro Médico Huerta Robles.</span>
      </div>
    </footer>
  `,
  styleUrl: './shell.component.css'
})
export class ShellComponent { }