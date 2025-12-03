import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService { // <--- DEBE DECIR 'export class'
  private apiUrl = 'http://localhost:8080/citas';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  agendarCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agendar`, cita, { headers: this.getHeaders() });
  }

  listarMisCitas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-citas`, { headers: this.getHeaders() });
  }
}