import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  agendarForm: FormGroup;
  
  // Aumentamos los pasos a 10 (porque insertamos uno nuevo)
  currentStep: number = 1;
  totalSteps: number = 10; 
  isLoading: boolean = false;
  
  resumen = {
    modalidad: '...',
    especialidad: '...',
    medico: '...',
    fecha: '...',
    hora: '',
    paciente: 'Yo (Titular)',
    ubicacion: '', // Nuevo campo para resumen
    pago: 'Pendiente',
    infoMedica: '...'
  };

  // Listas
  distritosTrujillo = [
    'Trujillo',
    'Víctor Larco Herrera',
    'La Esperanza',
    'El Porvenir',
    'Florencia de Mora',
    'Huanchaco',
    'Laredo',
    'Moche',
    'Salaverry'
  ];

  // Variables visuales
  selectedModalidad: string = ''; 
  selectedEspecialidadId: number | null = null; 
  selectedMedicoId: number | null = null; 
  
  // Calendario
  currentMonthDate: Date = new Date();
  calendarDays: any[] = [];
  selectedDateObj: Date | null = null;
  weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  today: Date = new Date();
  maxDate: Date = new Date();
  canGoBack: boolean = false;
  canGoNext: boolean = true;

  // Listas Data
  listaEspecialidades: any[] = [];
  listaMedicos: any[] = [];
  medicosFiltrados: any[] = []; 
  horariosGenerados: string[] = [];
  horariosOcupados: string[] = [];
  horaSeleccionada: string | null = null;

  mensaje: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private router: Router
  ) {
    this.agendarForm = this.fb.group({
      // Pasos 1-4
      modalidadId: ['', Validators.required],
      especialidadId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fechaDia: ['', Validators.required],
      horaInicio: ['', Validators.required],
      
      // Paso 5: Paciente
      esParaTercero: [false], 
      pacienteNombre: [''],
      pacienteApellido: [''],
      pacienteDni: [''],
      pacienteEmail: [''],
      pacienteTelefono: [''],

      // PASO 6: UBICACIÓN (NUEVO) - Solo Domicilio
      distrito: [''],
      direccionExacta: [''],
      referencia: [''],

      // Paso 7: Info Médica
      motivoConsulta: ['', [Validators.required, Validators.minLength(5)]],
      peso: ['', [Validators.min(0), Validators.max(600)]],
      altura: ['', [Validators.min(0), Validators.max(300)]],
      alergias: [''],
      antecedentes: [''],

      // Paso 8: Pago
      tipoPago: ['', Validators.required]
    });

    // Configurar fechas
    this.today.setHours(0,0,0,0);
    this.maxDate = new Date(this.today);
    this.maxDate.setDate(this.today.getDate() + 30);
    this.maxDate.setHours(0,0,0,0);
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.generarGrillaHorarios();
    this.generateCalendar();
    this.checkNavigationLimits();

    // ESCUCHAR CAMBIOS EN ESPECIALIDAD -> FILTRAR
    this.agendarForm.get('especialidadId')?.valueChanges.subscribe(espId => {
      this.filtrarMedicos();
    });

    // ESCUCHAR CAMBIOS EN MODALIDAD -> FILTRAR TAMBIÉN (Por si regresa al paso 1)
    this.agendarForm.get('modalidadId')?.valueChanges.subscribe(modId => {
      this.filtrarMedicos();
    });

    // Lógica de horarios ocupados
    this.agendarForm.get('fechaDia')?.valueChanges.subscribe(() => this.buscarOcupados());
    this.agendarForm.get('medicoId')?.valueChanges.subscribe(() => this.buscarOcupados());
  }


  
  cargarCatalogos() {
    this.citaService.getEspecialidades().subscribe({
      next: (data: any) => this.listaEspecialidades = data,
      error: (err: any) => console.error(err)
    });
    this.citaService.getMedicos().subscribe({
      next: (data: any) => { 
        this.listaMedicos = data; 
        // Ejecutar filtro inicial por si ya hay modalidad/especialidad seleccionada
        this.filtrarMedicos(); 
      },
      error: (err: any) => console.error(err)
    });
  }

  // --- NUEVA LÓGICA DE FILTRADO (REGLA: 1 Médico = 1 Modalidad) ---
  filtrarMedicos() {
    const espId = this.agendarForm.get('especialidadId')?.value;
    const modId = this.agendarForm.get('modalidadId')?.value; // 1=Consultorio, 2=Domicilio, 3=Virtual

    if (this.listaMedicos.length > 0 && espId && modId) {
      this.medicosFiltrados = this.listaMedicos.filter(m => {
        // 1. Validar Especialidad (ID directo o dentro de objeto)
        const idEsp = m.idEspecialidad || m.especialidad?.idEspecialidad;
        const matchEsp = idEsp == espId;

        // 2. Validar Modalidad
        // El backend envía 'idModalidad' o el objeto 'modalidad'
        const idMod = m.idModalidad || m.modalidad?.idModalidad;
        
        // Comparar IDs (usamos == para que no importe si es string o number)
        // Nota: Si un médico antiguo no tiene idModalidad, asumimos 1 (Consultorio) por defecto
        const matchMod = (idMod || 1) == modId;

        return matchEsp && matchMod;
      });
    } else {
      this.medicosFiltrados = [];
    }

    // Resetear selección si la lista cambió para evitar inconsistencias
    this.agendarForm.patchValue({ medicoId: '' });
  }

  // --- GETTERS ÚTILES ---
  get isDomicilio(): boolean { return this.agendarForm.get('modalidadId')?.value === 2; }
  get isPresencialAllowed(): boolean { return this.agendarForm.get('modalidadId')?.value === 1; }

  // --- LÓGICA PASOS ---
  
  selectModalidad(tipo: string) {
    this.selectedModalidad = tipo;
    let idBackend = 1; 
    if (tipo === 'DOMICILIO') idBackend = 2;
    if (tipo === 'VIRTUAL') idBackend = 3;
    
    this.agendarForm.patchValue({ modalidadId: idBackend, tipoPago: '' });
    this.resumen.pago = 'Pendiente';
    this.resumen.modalidad = tipo === 'CONSULTORIO' ? 'En Consultorio' : (tipo === 'DOMICILIO' ? 'A Domicilio' : 'Virtual');
    this.resumen.ubicacion = ''; // Reset ubicación

    // GESTIÓN DE VALIDACIONES DE DIRECCIÓN
    const distritoCtrl = this.agendarForm.get('distrito');
    const dirCtrl = this.agendarForm.get('direccionExacta');
    const refCtrl = this.agendarForm.get('referencia');

    if (idBackend === 2) {
      // Si es Domicilio, son obligatorios
      distritoCtrl?.setValidators([Validators.required]);
      dirCtrl?.setValidators([Validators.required, Validators.minLength(5)]);
      refCtrl?.setValidators([Validators.required]); // Referencia útil para el médico
    } else {
      // Si no, limpiamos
      distritoCtrl?.clearValidators();
      dirCtrl?.clearValidators();
      refCtrl?.clearValidators();
      
      distritoCtrl?.setValue('');
      dirCtrl?.setValue('');
      refCtrl?.setValue('');
    }
    distritoCtrl?.updateValueAndValidity();
    dirCtrl?.updateValueAndValidity();
    refCtrl?.updateValueAndValidity();

    setTimeout(() => this.nextStep(), 400); 
  }

  // ... (selectEspecialidad, selectMedico IGUALES) ...
  selectEspecialidad(esp: any) {
    this.selectedEspecialidadId = esp.idEspecialidad;
    this.resumen.especialidad = esp.nombre;
    this.agendarForm.patchValue({ especialidadId: esp.idEspecialidad });
    setTimeout(() => this.nextStep(), 400);
  }

  selectMedico(medico: any) {
    this.selectedMedicoId = medico.idMedico;
    this.resumen.medico = medico.nombreCompleto || `${medico.nombres} ${medico.apellidos}`;
    this.agendarForm.patchValue({ medicoId: medico.idMedico });
    setTimeout(() => this.nextStep(), 400);
  }

  // ... (Calendario y Horas IGUALES - onDateChange, etc.) ...
  generateCalendar() {
    this.calendarDays = [];
    const year = this.currentMonthDate.getFullYear();
    const month = this.currentMonthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); 

    for (let i = 0; i < startingDay; i++) this.calendarDays.push({ day: null, date: null, disabled: true });
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0,0,0,0);
      const isDisabled = date < this.today || date > this.maxDate;
      this.calendarDays.push({ day: i, date: date, disabled: isDisabled, isToday: date.getTime() === this.today.getTime() });
    }
  }

  changeMonth(delta: number) {
    const newDate = new Date(this.currentMonthDate);
    newDate.setMonth(newDate.getMonth() + delta);
    this.currentMonthDate = newDate;
    this.generateCalendar();
    this.checkNavigationLimits();
  }

  checkNavigationLimits() {
    const now = new Date();
    this.canGoBack = this.currentMonthDate.getMonth() > now.getMonth() || this.currentMonthDate.getFullYear() > now.getFullYear();
    const nextMonthDate = new Date(now);
    nextMonthDate.setMonth(now.getMonth() + 1);
    this.canGoNext = this.currentMonthDate < nextMonthDate; 
    if (this.currentMonthDate.getFullYear() > nextMonthDate.getFullYear()) this.canGoNext = false;
    else if (this.currentMonthDate.getFullYear() === nextMonthDate.getFullYear() && this.currentMonthDate.getMonth() >= nextMonthDate.getMonth()) this.canGoNext = false;
  }

  selectDate(dayObj: any) {
    if (dayObj.disabled || !dayObj.date) return;
    this.selectedDateObj = dayObj.date;
    this.horaSeleccionada = null; 
    this.agendarForm.patchValue({ horaInicio: '' });
    const year = dayObj.date.getFullYear();
    const month = (dayObj.date.getMonth() + 1).toString().padStart(2, '0');
    const day = dayObj.date.getDate().toString().padStart(2, '0');
    const fechaStr = `${year}-${month}-${day}`;
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    this.resumen.fecha = dayObj.date.toLocaleDateString('es-ES', opciones);
    this.resumen.hora = '';
    this.agendarForm.patchValue({ fechaDia: fechaStr });
    this.buscarOcupados();
  }

  isSelectedDate(date: Date): boolean {
    if (!date || !this.selectedDateObj) return false;
    return date.getTime() === this.selectedDateObj.getTime();
  }

  selectHora(hora: string) {
    if (this.horariosOcupados.includes(hora)) return;
    this.horaSeleccionada = hora;
    this.resumen.hora = `a las ${hora}`;
    this.agendarForm.patchValue({ horaInicio: hora });
  }

  generarGrillaHorarios() {
    let hora = 8;
    let min = 0;
    while (hora < 22) {
      this.horariosGenerados.push(`${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
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
        error: (err: any) => console.error(err)
      });
    }
  }

  // --- LÓGICA PACIENTE (Paso 5) ---
  selectPacienteOption(esTercero: boolean) {
    this.agendarForm.patchValue({ esParaTercero: esTercero });
    const controls = {
        nombre: this.agendarForm.get('pacienteNombre'),
        apellido: this.agendarForm.get('pacienteApellido'),
        dni: this.agendarForm.get('pacienteDni'),
        email: this.agendarForm.get('pacienteEmail'),
        tel: this.agendarForm.get('pacienteTelefono')
    };
    if (esTercero) {
      controls.nombre?.setValidators([Validators.required, Validators.minLength(2)]);
      controls.apellido?.setValidators([Validators.required, Validators.minLength(2)]);
      controls.dni?.setValidators([Validators.required, Validators.pattern(/^[0-9]{8}$/)]);
      controls.email?.setValidators([Validators.required, Validators.email]);
      controls.tel?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
      this.resumen.paciente = 'Tercero (Por definir)';
    } else {
      Object.values(controls).forEach(c => { c?.clearValidators(); c?.setValue(''); c?.updateValueAndValidity(); });
      this.resumen.paciente = 'Yo (Titular)';
    }
    Object.values(controls).forEach(c => c?.updateValueAndValidity());
  }

  onPacienteInput() {
    if (this.agendarForm.get('esParaTercero')?.value) {
      const nombre = this.agendarForm.get('pacienteNombre')?.value;
      const apellido = this.agendarForm.get('pacienteApellido')?.value;
      this.resumen.paciente = (nombre || apellido) ? `${nombre} ${apellido}` : 'Tercero...';
    }
  }

  // --- NUEVA LÓGICA UBICACIÓN (Paso 6) ---
  onUbicacionChange() {
    const distrito = this.agendarForm.get('distrito')?.value;
    const direccion = this.agendarForm.get('direccionExacta')?.value;
    if (this.isDomicilio && distrito && direccion) {
      this.resumen.ubicacion = `${distrito} - ${direccion}`;
    }
  }

  // --- INFO MÉDICA Y PAGO (Pasos 7 y 8) ---
  onMedicalInfoChange() {
    const motivo = this.agendarForm.get('motivoConsulta')?.value;
    if (motivo) this.resumen.infoMedica = motivo.length > 25 ? motivo.substring(0, 25) + '...' : motivo;
    else this.resumen.infoMedica = '...';
  }

  preventInvalidChars(event: KeyboardEvent) {
    const invalidChars = ['-', '+', 'e', 'E'];
    if (invalidChars.includes(event.key)) event.preventDefault();
  }

  selectTipoPago(tipo: string) {
    this.agendarForm.patchValue({ tipoPago: tipo });
    this.resumen.pago = tipo === 'ONLINE' ? 'Online (Tarjeta)' : 'En Caja (Presencial)';
    setTimeout(() => this.nextStep(), 400);
  }

  // --- NAVEGACIÓN INTELIGENTE (SALTO DE PASOS) ---
  nextStep() {
    // Si estoy en Paso 5 (Paciente) y NO ES domicilio, salto el Paso 6 (Ubicación)
    if (this.currentStep === 5 && !this.isDomicilio) {
      this.currentStep = 7; 
      return;
    }
    
    // Si estoy en un paso normal, avanzo 1
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    // Si estoy en Paso 7 (Info Médica) y NO ES domicilio, retrocedo al Paso 5 (Paciente) saltando el 6
    if (this.currentStep === 7 && !this.isDomicilio) {
      this.currentStep = 5;
      return;
    }

    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // --- SUBMIT FINAL ---
  submit() {
    if (this.agendarForm.valid) {
      this.isLoading = true;
      const fechaCompleta = `${this.agendarForm.value.fechaDia}T${this.agendarForm.value.horaInicio}:00`;
      
      const payload = {
        medicoId: this.agendarForm.value.medicoId,
        modalidadId: this.agendarForm.value.modalidadId,
        motivoConsulta: this.agendarForm.value.motivoConsulta,
        fechaHora: fechaCompleta,
        esParaTercero: this.agendarForm.value.esParaTercero,
        pacienteNombre: this.agendarForm.value.pacienteNombre,
        pacienteApellido: this.agendarForm.value.pacienteApellido,
        pacienteDni: this.agendarForm.value.pacienteDni,
        pacienteEmail: this.agendarForm.value.pacienteEmail,
        pacienteTelefono: this.agendarForm.value.pacienteTelefono,
        // Nuevos campos domicilio
        distrito: this.agendarForm.value.distrito,
        direccionExacta: this.agendarForm.value.direccionExacta,
        referencia: this.agendarForm.value.referencia,
        // Médicos
        peso: this.agendarForm.value.peso,
        altura: this.agendarForm.value.altura,
        alergias: this.agendarForm.value.alergias,
        antecedentes: this.agendarForm.value.antecedentes
      };

      this.citaService.agendarCita(payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.nextStep(); // Ir al paso final (Éxito)
        },
        error: (err: any) => {
          this.isLoading = false;
          this.error = 'Ocurrió un error al procesar tu cita. Por favor intenta de nuevo.';
          console.error(err);
        }
      });
    } else {
      this.agendarForm.markAllAsTouched();
      this.error = 'Faltan datos obligatorios.';
    }
  }
}
