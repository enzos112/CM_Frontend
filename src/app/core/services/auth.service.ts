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
  
  // "Radio" que emite el estado del usuario actual
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public user$ = this.userSubject.asObservable(); // Los componentes se suscriben a esto

  constructor(private http: HttpClient, private router: Router) { }

  // 1. Obtener usuario inicial (si ya estaba logueado al refrescar)
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
          // Avisar a toda la app que hay usuario nuevo
          this.userSubject.next(this.decodeToken(response.token)); 
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null); // Avisar que se fue
    this.router.navigate(['/login']);
  }

  saveToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Utilidad para decodificar JWT de forma segura
  private decodeToken(token: string): any {
    try {
      // 1. Separar el payload
      const base64Url = token.split('.')[1];
      
      // 2. Convertir Base64Url a Base64 estándar
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // 3. Decodificar la cadena Base64 a texto
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      // 4. Parsear el JSON
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  // Método público para obtener el valor actual sin suscribirse
  getUser(): any {
    return this.userSubject.value;
  }
}