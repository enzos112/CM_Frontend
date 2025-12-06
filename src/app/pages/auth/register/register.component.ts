import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common'; // Agregamos TitleCasePipe
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TitleCasePipe], // Incluir TitleCasePipe
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  maxDate: string; // Restricción de fecha

  tiposDocumento = [
    { value: 'DNI', name: 'DNI', pattern: '^[0-9]{8}$', length: 8 },
    { value: 'PASAPORTE', name: 'Pasaporte', pattern: '^[A-Z0-9]{6,20}$', length: 20 },
    { value: 'CE', name: 'Carnet Extranjería', pattern: '^[0-9]{9}$', length: 9 }
  ];
  // AGREGAMOS OPCIÓN INCLUSIVA DE GÉNERO
  generos = ['MASCULINO', 'FEMENINO', 'PREFIERO_NO_DECIRLO'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Restricción de fecha de nacimiento (hoy como máximo)
    this.maxDate = new Date().toISOString().split('T')[0];

    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required]], 
      
      tipoDocumento: ['DNI', Validators.required], 
      numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // DNI 8 dígitos por defecto

      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required], 
      telefonoMovil: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      // NUEVOS CAMPOS DE DIRECCIÓN
      region: [''],
      provincia: [''],
      distrito: [''],
      direccionCalle: [''],

      // NUEVOS CAMPOS DE EMERGENCIA (OPCIONALES)
      contactoEmergenciaNombres: [''], // Nuevo campo
      contactoEmergenciaApellidos: [''], // Nuevo campo
      contactoEmergenciaTelefono: [''], // Se mantiene igual
      
      esMenor: [false],
      tutorDni: [''],
      tutorNombre: [''],
      tutorTelefono: ['']
    });
  }

  ngOnInit(): void {
    // Lógica para cambiar validadores de longitud
    this.registerForm.get('tipoDocumento')?.valueChanges.subscribe(tipo => {
      const docControl = this.registerForm.get('numeroDocumento');

      
      const selectedDoc = this.tiposDocumento.find(d => d.value === tipo);
      

      if (selectedDoc) {
        docControl?.setValidators([
          Validators.required,
          Validators.maxLength(selectedDoc.length),
          Validators.pattern(selectedDoc.pattern) 
        ]);
      } else {
        docControl?.setValidators([Validators.required]);
      }
      docControl?.updateValueAndValidity();
    });

    // Lógica para hacer los campos del tutor opcionales/requeridos
    this.registerForm.get('esMenor')?.valueChanges.subscribe(esMenor => {
      const tutorDniControl = this.registerForm.get('tutorDni');
      const tutorNombreControl = this.registerForm.get('tutorNombre');

      if (esMenor) {
        tutorDniControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{8}$')]);
        tutorNombreControl?.setValidators([Validators.required]);
      } else {
        tutorDniControl?.setValidators(null);
        tutorNombreControl?.setValidators(null);
      }
      tutorDniControl?.updateValueAndValidity();
      tutorNombreControl?.updateValueAndValidity();
    });
  }


  onSubmit() {
    this.errorMessage = ''; // Limpiamos errores anteriores
    this.registerForm.markAllAsTouched(); // Marcamos todos para activar los mensajes visuales

    if (this.registerForm.valid) {
        // --- LÓGICA DE ÉXITO (Si todo es válido) ---
        const formValue = this.registerForm.value;
        // --- LÓGICA DE CONCATENACIÓN ---
        // Combinamos Nombres + Apellidos en un solo string para el campo único del Backend (contactoEmergenciaNombre)
        const nombreCompletoEmergencia = 
            (formValue.contactoEmergenciaNombres + ' ' + formValue.contactoEmergenciaApellidos).trim();

        const payload = {
            // ... (Mapeo de Payload) ...
            email: formValue.email,
            password: formValue.password,
            tipoDocumento: formValue.tipoDocumento,
            numeroDocumento: formValue.numeroDocumento,
            nombres: formValue.nombres,
            apellidoPaterno: formValue.apellidoPaterno,
            apellidoMaterno: formValue.apellidoMaterno,
            fechaNacimiento: formValue.fechaNacimiento,
            genero: formValue.genero,
            telefonoMovil: formValue.telefonoMovil,
            region: formValue.region,
            provincia: formValue.provincia,
            distrito: formValue.distrito,
            direccionCalle: formValue.direccionCalle,
            // Mapeo de Contacto de Emergencia: Nombres y Apellidos concatenados
            contactoEmergenciaNombre: nombreCompletoEmergencia,
            contactoEmergenciaTelefono: formValue.contactoEmergenciaTelefono,
        };

        this.authService.register(payload).subscribe({
            next: (response: any) => {
                this.authService.saveToken(response.token);
                this.successMessage = '¡Cuenta creada con éxito! Redirigiendo...';
                setTimeout(() => this.router.navigate(['/dashboard']), 1500);
            },
            error: (error: any) => {
                console.error(error);
                this.errorMessage = 'Error al registrar. Verifica si el DNI o Email ya existen.';
            }
        });

    } else {
        // --- LÓGICA DE FALLO (Buscamos el primer campo que impide el registro) ---
        const firstInvalidControl = Object.keys(this.registerForm.controls).find(key => 
            this.registerForm.get(key)?.invalid
        );

        if (firstInvalidControl) {
            // Mostrar el campo que está fallando en la alerta roja de la UI
            this.errorMessage = `Error de Validación: El campo '${firstInvalidControl.toUpperCase()}' es obligatorio o tiene un formato incorrecto.`;
            
            // Opcional: Para ver todos los errores internos en la consola (F12)
            Object.keys(this.registerForm.controls).forEach(key => {
                const control = this.registerForm.get(key);
                if (control?.invalid) {
                    console.warn(`❌ FALLÓ EL CONTROL: ${key}`, control.errors); 
                }
            });
        }
    }
  }
}