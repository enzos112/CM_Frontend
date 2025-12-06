import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// CORRECCIÓN: La ruta relativa ES correcta para la carpeta
import { HeaderComponent } from '../header/header.component'; 

@Component({
  selector: 'app-shell', 
  standalone: true,
  // AHORA FUNCIONARÁ: Una vez que el import se resuelve, el componente es válido.
  imports: [RouterOutlet, HeaderComponent], 
  
  // CORRECCIÓN: Asegúrate de que el template esté presente.
  template: `
    <app-header></app-header>
    
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