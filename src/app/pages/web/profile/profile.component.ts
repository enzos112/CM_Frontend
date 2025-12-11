import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../core/services/paciente.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario: any = null;
  historial: any[] = [];
  selectedAtencion: any = null; // Datos para el modal
  loading = true;

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 1. Obtener usuario del token/auth
    this.usuario = this.authService.getUser();
    
    // 2. Cargar historial médico
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.pacienteService.getHistorial().subscribe({
      next: (data) => {
        this.historial = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar historial', err);
        this.loading = false;
      }
    });
  }

  // Abre el modal y carga los detalles de la receta/atención
  verResultados(idCita: number) {
    this.pacienteService.getDetalleAtencion(idCita).subscribe({
      next: (data) => {
        this.selectedAtencion = data;
        this.abrirModal();
      },
      error: (err) => alert('Aún no hay resultados disponibles para esta cita.')
    });
  }

  abrirModal() {
    const modal = document.getElementById('modalReceta');
    if (modal) modal.style.display = 'flex';
  }

  cerrarModal() {
    this.selectedAtencion = null;
    const modal = document.getElementById('modalReceta');
    if (modal) modal.style.display = 'none';
  }

  // Redirige al endpoint del backend que genera el PDF
  descargarReceta(idCita: number) {
    // Ajusta la URL base si tu backend no está en localhost:8080
    window.open(`http://localhost:8080/documentos/receta/${idCita}`, '_blank');
  }
}