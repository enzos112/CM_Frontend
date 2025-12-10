import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <header class="topbar border-bottom">
      <div class="container-xxl d-flex align-items-center justify-content-between py-2 gap-3">
        <a class="brand d-flex align-items-center gap-2 text-decoration-none" routerLink="/">
          <div class="brand-mark d-flex align-items-center justify-content-center">
            <i class="bi bi-stack"></i>
          </div>
          <div class="brand-text">
            <div class="brand-overline">Centro Médico</div>
            <div class="brand-title">Huerta Robles</div>
          </div>
        </a>

        <nav class="d-none d-lg-flex align-items-center gap-4">
          <span class="nav-icon"><i class="bi bi-brightness-high"></i></span>
          <a class="nav-link px-0" routerLink="/app/nosotros">Nosotros</a>
          <a class="nav-link px-0" routerLink="/app/especialidades">Especialidades</a>
          <a class="nav-link px-0" routerLink="/app/medicos">Médicos</a>
          <a class="nav-link px-0" routerLink="/app/blog">Blog</a>
          <a class="nav-link px-0" routerLink="/app/contacto">Contacto</a>
        </nav>

        <div class="d-none d-lg-flex align-items-center gap-3 topbar-actions">
          <span class="nav-divider"></span>
          <a class="btn btn-ghost" routerLink="/login">Iniciar sesión</a>
          <a class="btn btn-light border register-btn" routerLink="/register">Registrarme</a>
          <a class="btn btn-primary cta header-cta" routerLink="/app/intranet/agendar-cita">Agendar Cita</a>
        </div>

        <button class="btn btn-outline-secondary d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileNavShell">
          <i class="bi bi-list"></i>
        </button>
      </div>
    </header>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileNavShell">
      <div class="offcanvas-header">
        <h5 class="mb-0">Menú</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column gap-3">
        <a class="nav-link" routerLink="/app/nosotros">Nosotros</a>
        <a class="nav-link" routerLink="/app/especialidades">Especialidades</a>
        <a class="nav-link" routerLink="/app/medicos">Médicos</a>
        <a class="nav-link" routerLink="/app/blog">Blog</a>
        <a class="nav-link" routerLink="/app/contacto">Contacto</a>
        <hr>
        <a class="btn btn-ghost w-100" routerLink="/login">Iniciar sesión</a>
        <a class="btn btn-light border w-100" routerLink="/register">Registrarme</a>
        <a class="btn btn-primary cta w-100" routerLink="/app/intranet/agendar-cita">Agendar Cita</a>
      </div>
    </div>

    <main class="content-wrapper">
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      <div class="container-xxl">
        <div class="footer-bottom text-center">
          © 2025 Centro Médico Huerta Robles. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  `,
  styleUrl: './shell.component.css'
})
export class ShellComponent { }
