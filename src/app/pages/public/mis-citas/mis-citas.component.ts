import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../core/services/cita.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.css'
})
export class MisCitasComponent implements OnInit {
  
  // Datos
  todasLasCitas: any[] = []; // Copia de respaldo para no perder datos al filtrar
  citasVisibles: any[] = []; // Las que se muestran en pantalla
  
  // Estado Visual
  isLoading: boolean = true;
  error: boolean = false;
  filtroActual: string = 'TODOS'; // TODOS, PENDIENTE, FINALIZADO, CANCELADO
  
  // Modal
  citaSeleccionada: any = null; // La cita que se muestra en el modal

  // Contadores para las cards de arriba
  counts = { todos: 0, pendientes: 0, finalizados: 0, cancelados: 0 };

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas() {
    this.isLoading = true;
    this.citaService.getMisCitas().subscribe({
      next: (data) => {
        this.todasLasCitas = data;
        this.calcularContadores();
        this.aplicarFiltro('TODOS'); // Por defecto mostramos todas
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  // --- LÓGICA DE FILTROS ---
  calcularContadores() {
    this.counts.todos = this.todasLasCitas.length;
    this.counts.pendientes = this.todasLasCitas.filter(c => ['PENDIENTE', 'PAGADO', 'CONFIRMADA'].includes(c.estado)).length;
    this.counts.finalizados = this.todasLasCitas.filter(c => ['FINALIZADO', 'ATENDIDO'].includes(c.estado)).length;
    this.counts.cancelados = this.todasLasCitas.filter(c => c.estado === 'CANCELADO').length;
  }

  aplicarFiltro(filtro: string) {
    this.filtroActual = filtro;
    
    if (filtro === 'TODOS') {
      this.citasVisibles = this.todasLasCitas;
    } else if (filtro === 'PENDIENTE') {
      this.citasVisibles = this.todasLasCitas.filter(c => ['PENDIENTE', 'PAGADO', 'CONFIRMADA'].includes(c.estado));
    } else if (filtro === 'FINALIZADO') {
      this.citasVisibles = this.todasLasCitas.filter(c => ['FINALIZADO', 'ATENDIDO'].includes(c.estado));
    } else if (filtro === 'CANCELADO') {
      this.citasVisibles = this.todasLasCitas.filter(c => c.estado === 'CANCELADO');
    }
  }

  // --- LÓGICA DEL MODAL ---
  abrirModal(cita: any) {
    this.citaSeleccionada = cita;
    // Bootstrap Modal Toggle (Forma simple sin jQuery)
    const modal = document.getElementById('detalleCitaModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      
      // Crear backdrop si no existe
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }
  }

  cerrarModal() {
    this.citaSeleccionada = null;
    const modal = document.getElementById('detalleCitaModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }

  // --- HELPERS VISUALES ---
  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bg-warning text-dark';
      case 'PAGADO': return 'bg-success text-white';
      case 'CANCELADO': return 'bg-danger text-white';
      case 'FINALIZADO': return 'bg-secondary text-white';
      default: return 'bg-light text-dark border';
    }
  }

  getModalidadIcon(modalidad: string): string {
    if (modalidad.includes('VIRTUAL')) return 'bi-camera-video';
    if (modalidad.includes('DOMICILIO')) return 'bi-house-heart';
    return 'bi-hospital'; 
  }
}