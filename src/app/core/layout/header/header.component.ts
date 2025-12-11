import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importante para *ngIf
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html', // Usaremos archivo externo
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  showDropdown = false; // Controla el menú desplegable

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  alert('¡HEADER CARGADO!'); // <--- AGREGAR ESTO
  console.log('Iniciando Header...');
  
  this.authService.user$.subscribe(user => {
    console.log('Usuario recibido:', user);
    this.currentUser = user;
  });
}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
  }
}