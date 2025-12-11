import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// --- Capa AUTH (sin header) ---
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
import { AgendarComponent as PublicAgendarComponent } from './pages/public/agendar/agendar.component';

// --- Capa ADMIN & WEB ---
import { ProfileComponent } from './pages/web/profile/profile.component';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AgendarComponent as AdminAgendarComponent } from './pages/admin/citas/agendar/agendar.component';
import { HorariosComponent } from './pages/admin/horarios/horarios.component';
import { PerfilComponent } from './pages/admin/perfil/perfil.component';
import { AjustesComponent } from './pages/admin/ajustes/ajustes.component';
import { SeguridadComponent } from './pages/admin/seguridad/seguridad.component';

export const routes: Routes = [
  // 1. Rutas sin layout (login y registro)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth/login', redirectTo: 'login' },
  { path: 'auth/register', redirectTo: 'register' },

  // Ruta rapida de agendamiento (CTA principal)
  { path: 'admin/agendar-cita', component: AdminAgendarComponent },

  // 2. Rutas con layout publico (Shell + header)
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'nosotros', component: NosotrosComponent },
      { path: 'especialidades', component: EspecialidadesComponent },
      { path: 'medicos', component: MedicosPublicoComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'agendar-cita', component: PublicAgendarComponent },

      // Perfil paciente
      { path: 'web/perfil', component: ProfileComponent },

      // Compatibilidad con rutas antiguas "/app/..."
      { path: 'app/nosotros', redirectTo: 'nosotros' },
      { path: 'app/especialidades', redirectTo: 'especialidades' },
      { path: 'app/medicos', redirectTo: 'medicos' },
      { path: 'app/blog', redirectTo: 'blog' },
      { path: 'app/contacto', redirectTo: 'contacto' }
    ]
  },

  // 3. Area de administracion (sin header del shell)
  {
    path: 'admin-panel',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'horarios', component: HorariosComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'ajustes', component: AjustesComponent },
      { path: 'seguridad', component: SeguridadComponent },
      { path: 'agendar-cita', component: AdminAgendarComponent }
    ]
  },

  // 4. Fallback
  { path: '**', redirectTo: '' }
];
