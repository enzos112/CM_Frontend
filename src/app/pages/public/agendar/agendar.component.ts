import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  agendarForm: FormGroup;
  
  // VARIABLES PARA EL HTML (VISUALES)
  currentStep: number = 1;
  totalSteps: number = 9; // <--- Agregado para el stepper
  selectedModalidad: string = ''; // <--- Agregado para selección visual de tarjetas
  
  mensaje: string = '';
  error: string = '';

  // Listas de datos
  listaEspecialidades: any[] = [];
  listaMedicos: any[] = [];
  medicosFiltrados: any[] = []; 

  // Horarios
  horariosGenerados: string[] = [];
  horariosOcupados: string[] = [];
  horaSeleccionada: string | null = null;

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private router: Router
  ) {
    this.agendarForm = this.fb.group({
      modalidadId: ['', Validators.required], // Inicialmente vacío
      especialidadId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fechaDia: ['', Validators.required],
      horaInicio: ['', Validators.required],
      motivoConsulta: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.generarGrillaHorarios();

    // Filtro de médicos
    this.agendarForm.get('especialidadId')?.valueChanges.subscribe(espId => {
      if (espId) {
        this.medicosFiltrados = this.listaMedicos.filter(m => {
             const idEspMedico = m.idEspecialidad || m.especialidad?.idEspecialidad; 
             return idEspMedico == espId;
        });
      }
      this.agendarForm.patchValue({ medicoId: '' });
    });

    // Horarios ocupados
    this.agendarForm.get('fechaDia')?.valueChanges.subscribe(() => this.buscarOcupados());
    this.agendarForm.get('medicoId')?.valueChanges.subscribe(() => this.buscarOcupados());
  }

  cargarCatalogos() {
    this.citaService.getEspecialidades().subscribe({
      next: (data: any) => this.listaEspecialidades = data,
      error: (err: any) => console.error('Error Especialidades:', err)
    });

    this.citaService.getMedicos().subscribe({
      next: (data: any) => {
        this.listaMedicos = data;
        this.medicosFiltrados = data; 
      },
      error: (err: any) => console.error('Error Médicos:', err)
    });
  }

  generarGrillaHorarios() {
    let hora = 8;
    let min = 0;
    while (hora < 22) {
      const hStr = hora.toString().padStart(2, '0');
      const mStr = min.toString().padStart(2, '0');
      this.horariosGenerados.push(`${hStr}:${mStr}`);
      min += 30;
      if (min === 60) { min = 0; hora++; }
    }
  }

  buscarOcupados() {
    const medicoId = this.agendarForm.get('medicoId')?.value;
    const fecha = this.agendarForm.get('fechaDia')?.value;

    if (medicoId && fecha) {
      this.citaService.getHorariosOcupados(medicoId, fecha).subscribe({
        next: (ocupados: any[]) => this.horariosOcupados = ocupados.map((h: string) => h.substring(0, 5)),
        error: (err: any) => console.error('Error horarios:', err)
      });
    }
  }

  seleccionarHorario(hora: string) {
    if (!this.horariosOcupados.includes(hora)) {
      this.horaSeleccionada = hora;
      this.agendarForm.patchValue({ horaInicio: hora });
    }
  }

  // --- LÓGICA DEL PASO 1 (MODALIDAD) ---
  
  // Esta función recibe el STRING del HTML ('CONSULTORIO')
  selectModalidad(tipo: string) {
    this.selectedModalidad = tipo; // Actualiza visualmente la tarjeta (borde azul)
    
    // Mapeamos el string visual al ID numérico que espera el Backend
    let idBackend = 1; 
    if (tipo === 'DOMICILIO') idBackend = 2;
    if (tipo === 'VIRTUAL') idBackend = 3;

    console.log(`Modalidad seleccionada: ${tipo} (ID: ${idBackend})`);
    
    this.agendarForm.patchValue({ modalidadId: idBackend });
    
    // Avanzamos al siguiente paso automáticamente (opcional)
    setTimeout(() => this.nextStep(), 400); 
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submit() {
    if (this.agendarForm.valid) {
      const fechaCompleta = `${this.agendarForm.value.fechaDia}T${this.agendarForm.value.horaInicio}:00`;
      const payload = {
        medicoId: this.agendarForm.value.medicoId,
        modalidadId: this.agendarForm.value.modalidadId,
        motivoConsulta: this.agendarForm.value.motivoConsulta,
        fechaHora: fechaCompleta
      };

      this.citaService.agendarCita(payload).subscribe({
        next: (res: any) => {
          this.mensaje = '¡Cita reservada con éxito!';
          setTimeout(() => this.router.navigate(['/intranet/dashboard']), 2000);
        },
        error: (err: any) => {
          this.error = 'Ocurrió un error al agendar.';
        }
      });
    } else {
      this.agendarForm.markAllAsTouched();
    }
  }
}