import { Routes } from '@angular/router';

// --- Capa AUTH ---
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

// --- Capa PUBLIC ---
import { HomeComponent } from './pages/public/home/home.component';
import { EspecialidadesComponent } from './pages/public/especialidades/especialidades.component';
import { MedicosPublicoComponent } from './pages/public/medicos/medicos.component';
import { NosotrosComponent } from './pages/public/nosotros/nosotros.component';
import { BlogComponent } from './pages/public/blog/blog.component';
import { ContactoComponent } from './pages/public/contacto/contacto.component';
import { ShellComponent } from './core/layout/shell/shell.component';

// --- Capa INTRANET & WEB ---
import { DashboardComponent } from './pages/intranet/dashboard/dashboard.component';
import { AgendarComponent } from './pages/intranet/citas/agendar/agendar.component';
import { ProfileComponent } from './pages/web/profile/profile.component';

export const routes: Routes = [
  // 1. Rutas SIN Layout (Login y Registro no llevan menú)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth/login', redirectTo: 'login' },
  { path: 'auth/register', redirectTo: 'register' },

  // 2. Rutas CON Layout (Todas usan el ShellComponent y su Header)
  {
    path: '',
    component: ShellComponent, // <--- AQUÍ ESTÁ LA CLAVE
    children: [
      // Home ahora es hijo del Shell, por lo que tendrá el Header Inteligente
      { path: '', component: HomeComponent }, 

      // Páginas Públicas
      { path: 'nosotros', component: NosotrosComponent },
      { path: 'especialidades', component: EspecialidadesComponent },
      { path: 'medicos', component: MedicosPublicoComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'contacto', component: ContactoComponent },

      // Ruta Paciente (Perfil) - Ahora dentro del Shell
      { path: 'web/perfil', component: ProfileComponent },

      // Rutas Intranet
      {
        path: 'intranet',
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'agendar-cita', component: AgendarComponent },
        ]
      },

      // Compatibilidad con rutas antiguas "/app/..." (Redirigen a la nueva URL limpia)
      { path: 'app/nosotros', redirectTo: 'nosotros' },
      { path: 'app/especialidades', redirectTo: 'especialidades' },
      { path: 'app/medicos', redirectTo: 'medicos' },
      { path: 'app/blog', redirectTo: 'blog' },
      { path: 'app/contacto', redirectTo: 'contacto' }
    ]
  },

  // 3. Cualquier ruta desconocida redirige al Home
  { path: '**', redirectTo: '' }
];