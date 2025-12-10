import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-5">
      <div class="container">
        <p class="text-uppercase text-primary fw-semibold mb-2">Contacto</p>
        <h1 class="fw-bold mb-4">Estamos para ayudarte</h1>

        <div class="row g-4">
          <div class="col-md-6">
            <div class="p-3 border rounded-3 bg-white h-100">
              <h5 class="fw-bold mb-3">Información</h5>
              <p class="mb-2 text-muted">Av. Principal 123, Lima, Perú</p>
              <p class="mb-2 text-muted">citas@huertarobles.com</p>
              <p class="mb-0 text-muted">(01) 555-1234</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-3 border rounded-3 bg-white h-100">
              <h5 class="fw-bold mb-3">Envíanos un mensaje</h5>
              <form class="row g-3">
                <div class="col-12">
                  <label class="form-label">Nombre</label>
                  <input class="form-control" type="text" placeholder="Tu nombre">
                </div>
                <div class="col-12">
                  <label class="form-label">Correo</label>
                  <input class="form-control" type="email" placeholder="nombre@ejemplo.com">
                </div>
                <div class="col-12">
                  <label class="form-label">Mensaje</label>
                  <textarea class="form-control" rows="3" placeholder="Cuéntanos en qué podemos ayudarte"></textarea>
                </div>
                <div class="col-12">
                  <button type="button" class="btn btn-primary w-100">Enviar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactoComponent { }
