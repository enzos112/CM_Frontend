import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ValueCard {
  title: string;
  desc: string;
  icon: string; // icon class
}

interface TeamMember {
  name: string;
  role: string;
  img?: string | null; // optional image url
  initials?: string;
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent {
  // Valores
  values: ValueCard[] = [
    {
      title: 'Calidad Humana',
      desc: 'Brindamos un trato cercano y empático, creando un ambiente de confianza y seguridad.',
      icon: 'bi-heart'
    },
    {
      title: 'Excelencia Médica',
      desc: 'Nos comprometemos con los más altos estándares de calidad y seguridad en cada diagnóstico.',
      icon: 'bi-award'
    },
    {
      title: 'Innovación Constante',
      desc: 'Incorporamos tecnología de vanguardia para ofrecer las mejores soluciones de salud.',
      icon: 'bi-lightbulb'
    },
    {
      title: 'Compromiso Comunitario',
      desc: 'Trabajamos activamente en la promoción de la salud y el bienestar de nuestra comunidad.',
      icon: 'bi-people'
    }
  ];

  // Equipo
  team: TeamMember[] = [
    { name: 'Dr. Alejandro Huerta', role: 'Cardiología', img: null, initials: 'DAH' },
    { name: 'Dra. Valentina Rojas', role: 'Cardiología', img: null, initials: 'VR' },
    { name: 'Dr. Javier Castillo', role: 'Cardiología', img: null, initials: 'JC' }
  ];
  // ... tus propiedades existentes (values, team) ...

  // Datos para la tarjeta grande de la izquierda
  socialFeature = {
    title: 'Compromiso Social',
    desc: 'Creemos en el poder de la prevención y la educación. Realizamos campañas de salud gratuitas y charlas informativas para fortalecer el bienestar de nuestra comunidad.',
    icon: 'bi-people' // Icono de grupo de personas
  };

  // Datos para la lista de la derecha
  detailFeatures = [
    {
      title: 'Nuestro Modelo de Atención',
      desc: 'Nos centramos en el paciente, con un enfoque integral que considera todos los aspectos de su vida para un diagnóstico y tratamiento precisos.',
      icon: 'bi-clipboard-pulse' // Icono médico/historial
    },
    {
      title: 'Seguridad del Paciente',
      desc: 'Implementamos rigurosos protocolos de seguridad y calidad para garantizar una atención segura y confiable en todo momento.',
      icon: 'bi-shield-check' // Icono de escudo
    },
    {
      title: 'Tecnología e Innovación',
      desc: 'Invertimos en equipos de última generación y en la capacitación constante de nuestro personal para ofrecerte lo mejor de la medicina moderna.',
      icon: 'bi-motherboard' // O bi-robot, bi-laptop-medical
    }
  ];
}
