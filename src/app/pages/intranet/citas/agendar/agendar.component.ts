import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService } from '../../../../core/services/cita.service';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  agendarForm: FormGroup;
  currentStep: number = 1;
  mensaje: string = '';
  error: string = '';

  // Listas de datos
  listaEspecialidades: any[] = [];
  listaMedicos: any[] = [];
  medicosFiltrados: any[] = []; // Para mostrar en el select

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
      modalidadId: [1, Validators.required],
      especialidadId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fechaDia: ['', Validators.required],
      horaInicio: ['', Validators.required],
      motivoConsulta: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    console.log('1. Iniciando AgendarComponent...');
    this.cargarCatalogos();
    this.generarGrillaHorarios();

    // LOGIC: Filtro de médicos al cambiar especialidad
    this.agendarForm.get('especialidadId')?.valueChanges.subscribe(espId => {
      console.log('⚡ Cambio Especialidad ID:', espId);
      if (espId) {
        // Filtramos la lista completa de médicos
        this.medicosFiltrados = this.listaMedicos.filter(m => {
             // Verificamos si la propiedad es idEspecialidad o id_especialidad (ajuste dinámico)
             const idEspMedico = m.idEspecialidad || m.especialidad?.idEspecialidad; 
             return idEspMedico == espId;
        });
        console.log('   -> Médicos filtrados:', this.medicosFiltrados.length);
      }
      this.agendarForm.patchValue({ medicoId: '' });
    });

    // LOGIC: Buscar horarios ocupados
    this.agendarForm.get('fechaDia')?.valueChanges.subscribe(() => this.buscarOcupados());
    this.agendarForm.get('medicoId')?.valueChanges.subscribe(() => this.buscarOcupados());
  }

  cargarCatalogos() {
    console.log('2. Solicitando catálogos al Backend...');

    // 1. Especialidades
    this.citaService.getEspecialidades().subscribe({
      next: (data) => {
        console.log('✅ Especialidades recibidas:', data);
        this.listaEspecialidades = data;
      },
      error: (err) => console.error('❌ Error cargando Especialidades:', err)
    });

    // 2. Médicos
    this.citaService.getMedicos().subscribe({
      next: (data) => {
        console.log('✅ Médicos recibidos (RAW):', data);
        
        // Diagnóstico de estructura
        if (data.length > 0) {
          console.log('   Ejemplo Médico [0]:', data[0]);
        } else {
          console.warn('⚠️ La lista de médicos llegó vacía desde el Backend.');
        }

        this.listaMedicos = data;
        this.medicosFiltrados = data; // Inicialmente mostramos todos (o vacio)
      },
      error: (err) => console.error('❌ Error cargando Médicos:', err)
    });
  }

  // --- LÓGICA DE HORARIOS ---
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
      console.log(`🔎 Buscando horarios ocupados Medico: ${medicoId}, Fecha: ${fecha}`);
      this.citaService.getHorariosOcupados(medicoId, fecha).subscribe({
        next: (ocupados) => {
            console.log('   -> Ocupados:', ocupados);
            this.horariosOcupados = ocupados.map(h => h.substring(0, 5));
        },
        error: (err) => console.error('Error buscando horarios', err)
      });
    }
  }

  seleccionarHorario(hora: string) {
    if (!this.horariosOcupados.includes(hora)) {
      this.horaSeleccionada = hora;
      this.agendarForm.patchValue({ horaInicio: hora });
    }
  }

  // --- WIZARD NAVIGATION ---
  selectModalidad(id: number) {
    console.log(`3. Seleccionada modalidad ID: ${id}`);
    this.agendarForm.patchValue({ modalidadId: id });
    this.nextStep();
  }

  nextStep() {
    if (this.currentStep < 3) {
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

      console.log('📤 Enviando Cita:', payload);

      this.citaService.agendarCita(payload).subscribe({
        next: (res) => {
          console.log('🎉 Cita agendada:', res);
          this.mensaje = '¡Cita reservada con éxito!';
          setTimeout(() => this.router.navigate(['/intranet/dashboard']), 2000);
        },
        error: (err) => {
          console.error('❌ Error al agendar:', err);
          this.error = 'Ocurrió un error al agendar. Intenta nuevamente.';
        }
      });
    } else {
      this.agendarForm.markAllAsTouched();
    }
  }
}