import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  
  // Datos para los desplegables (FAQs)
  faqs: FaqItem[] = [
    {
      question: '¿Cómo puedo reprogramar mi cita?',
      answer: 'Puedes reprogramar tu cita ingresando a tu cuenta en la sección "Mis Citas" o llamando a nuestra central telefónica con 24 horas de anticipación.',
      isOpen: false
    },
    {
      question: '¿Cómo veo los resultados de mis análisis?',
      answer: 'Los resultados estarán disponibles en tu perfil en línea 48 horas después de la toma de muestra. Te llegará un correo de notificación.',
      isOpen: false
    }
  ];

  // Función para abrir/cerrar preguntas
  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  // Simulación de envío
  enviarConsulta(event: Event): void {
    event.preventDefault();
    alert('Consulta enviada correctamente (Simulación)');
  }
}