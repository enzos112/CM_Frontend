import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-5">
      <div class="container">
        <p class="text-uppercase text-primary fw-semibold mb-2">Blog</p>
        <h1 class="fw-bold mb-4">Notas de salud y bienestar</h1>

        <div class="row g-4">
          <div class="col-md-4" *ngFor="let post of posts">
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <p class="text-primary fw-semibold mb-2">{{ post.category }}</p>
                <h5 class="card-title">{{ post.title }}</h5>
                <p class="card-text text-muted">{{ post.excerpt }}</p>
                <a class="mt-auto text-decoration-none fw-semibold" routerLink="/app/intranet/agendar-cita">
                  Leer más
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class BlogComponent {
  protected readonly posts = [
    {
      category: 'Prevención',
      title: 'Chequeos preventivos anuales',
      excerpt: 'Qué exámenes priorizar según edad y antecedentes familiares.'
    },
    {
      category: 'Estilo de vida',
      title: 'Hábitos que fortalecen tu salud cardiovascular',
      excerpt: 'Rutinas simples para cuidar tu corazón día a día.'
    },
    {
      category: 'Familia',
      title: 'Vacunación y cuidado pediátrico',
      excerpt: 'Recomendaciones para mantener al día el calendario de vacunas.'
    }
  ];
}
