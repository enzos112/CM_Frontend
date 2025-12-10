import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Specialty {
  title: string;
  desc: string;
  icon: string; // Clase de Bootstrap Icon
}

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent {
  specialties: Specialty[] = [
    {
      title: 'Cardiología',
      desc: 'Diagnóstico y tratamiento de enfermedades del corazón.',
      icon: 'bi-heart-pulse'
    },
    {
      title: 'Pediatría',
      desc: 'Atención médica integral para niños y adolescentes.',
      icon: 'bi-emoji-smile' // O bi-balloon
    },
    {
      title: 'Dermatología',
      desc: 'Cuidado de la piel, cabello y uñas.',
      icon: 'bi-sun'
    },
    {
      title: 'Nutrición',
      desc: 'Asesoramiento para una alimentación saludable y equilibrada.',
      icon: 'bi-apple' // requiere icono de manzana o similar
    },
    {
      title: 'Ginecología',
      desc: 'Salud integral de la mujer y sistema reproductivo.',
      icon: 'bi-shield-check' // O bi-gender-female
    },
    {
      title: 'Medicina General',
      desc: 'Atención primaria y diagnóstico general para toda la familia.',
      icon: 'bi-clipboard-pulse'
    },
    {
      title: 'Neurología',
      desc: 'Estudio y tratamiento de los trastornos del sistema nervioso.',
      icon: 'bi-activity' // O bi-brain si tienes la versión más reciente de iconos
    }
  ];
}