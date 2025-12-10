import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Borramos RouterLink de aquí porque no se usa en el HTML

interface BlogPost {
  title: string;
  excerpt?: string;
  date: string;
  category: string;
  image: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule], /* <--- Aquí quitamos RouterLink */
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  
  posts: BlogPost[] = [
    {
      title: '5 Hábitos Diarios para un Corazón Más Sano',
      excerpt: 'Pequeños cambios en tu rutina pueden tener un gran impacto en tu salud cardiovascular. Descubre cuáles son.',
      date: '15 de Julio, 2024',
      category: 'Cardiología',
      image: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'La Importancia de la Vacunación Infantil',
      excerpt: 'Protege a tus hijos y a la comunidad. Aclaramos mitos y respondemos a las preguntas más frecuentes sobre vacunas.',
      date: '10 de Julio, 2024',
      category: 'Pediatría',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Protección Solar: ¿Por Qué es Importante Todo el Año?',
      excerpt: 'El sol no descansa en invierno. Te explicamos por qué debes usar protector solar incluso en días nublados.',
      date: '5 de Julio, 2024',
      category: 'Dermatología',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop'
    }
  ];

  featured: BlogPost[] = [
    {
      title: 'La Importancia de la Vacunación Infantil',
      date: '10 de Julio, 2024',
      category: 'Pediatría',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=200&auto=format&fit=crop'
    },
    {
      title: 'Protección Solar: ¿Por Qué es Importante Todo el Año?',
      date: '5 de Julio, 2024',
      category: 'Dermatología',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200&auto=format&fit=crop'
    }
  ];
}