import { Routes } from '@angular/router';

// --- Capa AUTH ---
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

// --- Capa PUBLIC ---
import { HomeComponent } from './pages/public/home/home.component';
import { EspecialidadesComponent } from './pages/public/especialidades/especialidades.component';
import { MedicosPublicoComponent } from './pages/public/medicos/medicos.component'; 
import { ShellComponent } from './core/layout/shell/shell.component'; 

// --- Capa INTRANET ---
import { DashboardComponent } from './pages/intranet/dashboard/dashboard.component';
import { AgendarComponent } from './pages/intranet/citas/agendar/agendar.component';

export const routes: Routes = [
  // EL SHELL ES AHORA EL CONTENEDOR PRINCIPAL
  {
    path: '',
    component: ShellComponent, // Todas las rutas se cargan dentro del Header/Footer
    children: [
      // 1. RUTAS PÚBLICAS Y DE INFORMACIÓN
      { path: '', component: HomeComponent }, // / -> Home
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'especialidades', component: EspecialidadesComponent },
      { path: 'medicos', component: MedicosPublicoComponent },

      // 2. RUTAS PROTEGIDAS (INTRANET)
      {
        path: 'intranet',
        // Aquí implementaremos el CanActivate Guard
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'agendar-cita', component: AgendarComponent }, 
          // Aquí irán todas las rutas de /medico/, /admin/, /perfil/, etc.
        ]
      },
      
      // 3. Manejo de URLs no encontradas (404)
      { path: '**', redirectTo: '' } 
    ]
  }
];