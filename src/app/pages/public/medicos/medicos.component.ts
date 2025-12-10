import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  role: string; // Ej: "Cardiología" (para mostrar en la tarjeta)
  category: string; // Ej: "cardiologia" (para filtrar)
}

@Component({
  selector: 'app-medicos-publico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicos.component.html', // Asegúrate de tener el archivo .html
  styleUrls: ['./medicos.component.css']      // Asegúrate de tener el archivo .css
})
export class MedicosPublicoComponent {
  
  // Categoría seleccionada por defecto
  activeTab: string = 'Cardiología';

  // Lista de pestañas disponibles
  specialties: string[] = [
    'Cardiología', 
    'Pediatría', 
    'Dermatología', 
    'Neurología'
  ];

  // Base de datos simulada de médicos
  doctors: Doctor[] = [
    { id: 1, name: 'Dr. Alejandro Huerta', specialty: 'Cardiología', role: 'Cardiólogo Intervencionista', category: 'Cardiología' },
    { id: 2, name: 'Dra. Valentina Rojas', specialty: 'Cardiología', role: 'Cardiología Clínica', category: 'Cardiología' },
    { id: 3, name: 'Dr. Manuel Ortiz', specialty: 'Pediatría', role: 'Pediatra Neonatólogo', category: 'Pediatría' },
    { id: 4, name: 'Dra. Elena Vazquez', specialty: 'Pediatría', role: 'Pediatría General', category: 'Pediatría' },
    { id: 5, name: 'Dr. Raul Meza', specialty: 'Dermatología', role: 'Dermatólogo', category: 'Dermatología' },
    { id: 6, name: 'Dra. Sofa Paredes', specialty: 'Neurología', role: 'Neuróloga', category: 'Neurología' }
  ];

  // Función para cambiar de pestaña
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Getter para obtener solo los médicos de la pestaña activa
  get filteredDoctors() {
    return this.doctors.filter(d => d.category === this.activeTab);
  }
}