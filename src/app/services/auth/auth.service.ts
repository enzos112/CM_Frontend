import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Asegúrate que este puerto sea el mismo de tu Spring Boot
  private apiUrl = 'http://localhost:8080/auth'; 

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Método auxiliar para guardar el token
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
}