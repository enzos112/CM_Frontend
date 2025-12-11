import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Fuente de verdad del usuario
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private getUserFromStorage(): any {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  saveToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
      const user = this.decodeToken(token);
      this.userSubject.next(user); 
    }
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // --- LÓGICA DE DECODIFICACIÓN Y MAPEO ---
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);

      // PARCHE DE ROL: USER -> PACIENTE
      if (payload.role === 'USER') {
        payload.role = 'PACIENTE';
      }

      // IMPORTANTE: Asegurarnos de que el 'sub' (email) esté accesible como 'email'
      if (!payload.email && payload.sub) {
        payload.email = payload.sub;
      }

      return payload;
    } catch (e) {
      console.error('Error al decodificar token', e);
      return null;
    }
  }

  getUser(): any {
    return this.userSubject.value;
  }

  // Método para actualizar perfil
  updateProfile(data: any): Observable<any> {
    // El interceptor ya pone el token, así que no necesitamos headers manuales
    return this.http.put(`${this.apiUrl.replace('/auth', '/usuario')}/perfil`, data).pipe(
      tap((response: any) => {
        if (response.token) {
          // GUARDAMOS EL NUEVO TOKEN (que trae los datos actualizados)
          this.saveToken(response.token); 
        }
      })
    );
  }

  changePassword(newPassword: string): Observable<any> {
    // Agregamos { responseType: 'text' } para que Angular acepte el string que devuelve Java
    return this.http.put(
      `${this.apiUrl.replace('/auth', '/usuario')}/change-password`, 
      { newPassword },
      { responseType: 'text' } 
    );
  }

  changeEmail(newEmail: string): Observable<any> {
    return this.http.put(`${this.apiUrl.replace('/auth', '/usuario')}/change-email`, { newEmail }).pipe(
      tap((response: any) => {
        if (response.token) {
          // Guardamos el nuevo token inmediatamente para que la sesión no muera
          this.saveToken(response.token);
        }
      })
    );
  }

}