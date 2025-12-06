import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h1>Bienvenido al Dashboard</h1>
      <button (click)="logout()" class="btn btn-danger mb-3">Cerrar Sesión</button>
      
      <h3>Mis Citas</h3>
      <div *ngIf="citas.length === 0">No tienes citas agendadas.</div>
      <ul>
        <li *ngFor="let cita of citas">
          {{ cita.fechaHora }} - {{ cita.modalidad }} con {{ cita.nombreMedico }}
        </li>
      </ul>
    </div>
  `,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  citas: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Al cargar, pedimos las citas. El interceptor pondrá el token.
    this.http.get<any[]>(`${environment.apiUrl}/citas/mis-citas`)
      .subscribe({
        next: (data) => this.citas = data,
        error: (err) => console.error('Error al obtener citas', err)
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}