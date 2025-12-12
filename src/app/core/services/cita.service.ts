import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root' // <--- ESTO ES VITAL para que funcione la inyección
})
export class CitaService {
  private apiUrl = `${environment.apiUrl}`; // http://localhost:8080

  constructor(private http: HttpClient) { }

  // 1. Obtener Catálogos para los Selects
  getEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogo/especialidades`);
  }

  getMedicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogo/medicos`);
  }

  // 2. Agendar la Cita (La prueba que hiciste en Postman)
  agendarCita(citaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/citas/agendar`, citaData);
  }

  // 3. Listar mis citas (Para el Dashboard futuro)
  getMisCitas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/citas/mis-citas`);
  }
  getHorariosOcupados(medicoId: number, fecha: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/citas/horarios-ocupados?medicoId=${medicoId}&fecha=${fecha}`);
  }

  
}