import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html', 
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  showDropdown = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscripción al estado del usuario (Sin alertas ni logs)
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      // Opcional: Si el usuario cambia (ej: logout), cerramos el dropdown
      this.showDropdown = false;
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