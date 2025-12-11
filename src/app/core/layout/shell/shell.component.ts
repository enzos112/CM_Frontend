import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component'; // <--- 1. IMPORTAR

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent], // <--- 2. INYECTAR AQUÍ
  templateUrl: './shell.component.html',    // <--- 3. USAR EL ARCHIVO HTML NUEVO
  styleUrls: ['./shell.component.css']      // (Nota: es styleUrls en plural)
})
export class ShellComponent { }