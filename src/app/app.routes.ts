import { Routes } from '@angular/router';

// --- Capa AUTH (Sin Header) ---
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

// --- Capa PUBLIC & SHELL ---
import { ShellComponent } from './core/layout/shell/shell.component';
import { HomeComponent } from './pages/public/home/home.component';
import { NosotrosComponent } from './pages/public/nosotros/nosotros.component';
import { EspecialidadesComponent } from './pages/public/especialidades/especialidades.component';
import { MedicosPublicoComponent } from './pages/public/medicos/medicos.component';
import { BlogComponent } from './pages/public/blog/blog.component';
import { ContactoComponent } from './pages/public/contacto/contacto.component';

// --- Capa PRIVADA (Paciente/Médico/Admin) ---
import { ProfileComponent } from './pages/web/profile/profile.component';
import { DashboardComponent } from './pages/intranet/dashboard/dashboard.component';
import { AgendarComponent } from './pages/public/agendar/agendar.component';

export const routes: Routes = [
  // 1. Rutas SIN Layout (Login y Registro)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth/login', redirectTo: 'login' },
  { path: 'auth/register', redirectTo: 'register' },

  // 2. Rutas CON Layout (Todas usan el ShellComponent y su Header)
  {
    path: '', 
    component: ShellComponent, // <--- EL HEADER VIVE AQUÍ
    children: [
      // Home ahora es hijo del Shell -> ¡Header visible!
      { path: '', component: HomeComponent }, 
      
      // Páginas Públicas
      { path: 'nosotros', component: NosotrosComponent },
      { path: 'especialidades', component: EspecialidadesComponent },
      { path: 'medicos', component: MedicosPublicoComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'contacto', component: ContactoComponent },

      // Rutas Paciente (Perfil)
      { path: 'web/perfil', component: ProfileComponent },

      // Rutas Intranet & Procesos
      {
        path: 'intranet',
        children: [
          { path: 'dashboard', component: DashboardComponent },
          // Aquí está tu componente Agendar en la ruta correcta
          { path: 'agendar-cita', component: AgendarComponent }, 
        ]
      },

      // Compatibilidad con rutas viejas "/app/..."
      { path: 'app/nosotros', redirectTo: 'nosotros' },
      { path: 'app/especialidades', redirectTo: 'especialidades' },
      { path: 'app/medicos', redirectTo: 'medicos' }
    ]
  },

  // 3. Fallback
  { path: '**', redirectTo: '' }
];