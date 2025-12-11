import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Importar idioma español para la fecha
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es-ES');

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // Solo necesitamos CommonModule aquí
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  citas: any[] = [];
  citasFiltradas: any[] = [];
  currentDate: Date = new Date();
  filtroActual: string = 'Todas';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerCitas();
  }

  obtenerCitas() {
    this.loading = true;
    // Asegúrate de que esta URL coincida con tu Backend
    this.http.get<any[]>(`${environment.apiUrl}/citas/mis-citas`)
      .subscribe({
        next: (data) => {
          this.citas = data;
          this.filtrarCitas();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando citas', err);
          this.loading = false;
        }
      });
  }

  setFiltro(nuevoFiltro: string) {
    this.filtroActual = nuevoFiltro;
    this.filtrarCitas();
  }

  filtrarCitas() {
    if (this.filtroActual === 'Todas') {
      this.citasFiltradas = this.citas;
    } else {
      // Filtramos por la propiedad 'estado' (ajusta si tu BD usa otro nombre)
      this.citasFiltradas = this.citas.filter(c => c.estado === this.filtroActual);
    }
  }
}