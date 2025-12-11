import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, DatePipe], // Importante: DatePipe para la fecha
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent {
  currentDate: Date = new Date();
  // Aquí cargarías los datos reales más adelante
  horarios: any[] = []; 
  loading: boolean = false;
}