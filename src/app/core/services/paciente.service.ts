import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = `${environment.apiUrl}/web`; // Apunta a /web del backend

  constructor(private http: HttpClient) {}

  // Obtener historial de citas
  getHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`);
  }

  // Obtener detalle de atención (Receta/Diagnóstico)
  getDetalleAtencion(idCita: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/atencion/${idCita}`);
  }

  // Actualizar perfil (Teléfono/Dirección)
  updatePerfil(datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/perfil`, datos);
  }
}