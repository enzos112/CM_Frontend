import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// CORRECCIÓN AQUÍ: Ajustamos la ruta a 3 niveles
import { CitaService } from '../../../services/cita/cita.service'; 

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent {
  currentStep = 1;
  agendarForm: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private citaService: CitaService // Ahora sí reconocerá esto
  ) {
    this.agendarForm = this.fb.group({
      modalidad: ['', Validators.required],
      medicoId: [1, Validators.required], 
      fechaHora: ['', Validators.required],
      motivoConsulta: ['', Validators.required],
      peso: [''],
      altura: ['']
    });
  }

  nextStep() {
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  selectModalidad(tipo: string) {
    this.agendarForm.get('modalidad')?.setValue(tipo);
    this.nextStep();
  }

  submit() {
    if (this.agendarForm.valid) {
      const formData = this.agendarForm.value;
      
      this.citaService.agendarCita(formData).subscribe({
        next: (response: any) => {
          console.log('Cita creada:', response);
          alert('¡Cita agendada con éxito!'); 
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Error al agendar:', error);
          alert('Hubo un error. Verifica que tengas sesión iniciada.');
        }
      });
    } else {
      alert("Por favor completa todos los campos requeridos");
    }
  }
}