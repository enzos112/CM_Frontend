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
  // Rutas que NO usan el shell (Home, Auth)
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Agrupar todas las demás rutas bajo el shell
  {
    path: 'app',
    component: ShellComponent,
    children: [
      { path: 'especialidades', component: EspecialidadesComponent },
      { path: 'medicos', component: MedicosPublicoComponent },
      {
        path: 'intranet',
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'agendar-cita', component: AgendarComponent },
        ]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];