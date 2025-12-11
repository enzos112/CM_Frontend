// ARCHIVO: register.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
// Asegúrate de importar la data del archivo que creamos arriba
import { UBIGEO_PERU } from './../../../data/ubigeo.data'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TitleCasePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  maxDate: string;
  
  // Variables de control visual
  currentStep: number = 1;
  totalSteps: number = 5;
  isLoading: boolean = false; // VARIABLE LOCAL PARA EVITAR EL ERROR

  // Variables para listas desplegables
  departamentos: string[] = [];
  provincias: string[] = [];
  distritos: string[] = [];

  tiposDocumento = [
    { value: 'DNI', name: 'DNI (Doc. Nacional de Identidad)', pattern: '^[0-9]{8}$', length: 8 },
    { value: 'CE', name: 'Carnet Extranjería', pattern: '^[0-9]{9}$', length: 9 },
    { value: 'PASAPORTE', name: 'Pasaporte', pattern: '^[A-Z0-9]{6,20}$', length: 20 }
  ];

  generos = ['MASCULINO', 'FEMENINO', 'PREFIERO_NO_DECIRLO'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.maxDate = new Date().toISOString().split('T')[0];

    // Cargar departamentos iniciales
    this.departamentos = Object.keys(UBIGEO_PERU);

    this.registerForm = this.fb.group({
      // PASO 1
      tipoDocumento: ['DNI', Validators.required], 
      numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      
      // PASO 2
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required]], 
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required], 

      // PASO 3
      telefonoMovil: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, Validators.requiredTrue],
      acceptConsent: [false, Validators.requiredTrue],

      // PASO 4
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', Validators.required],

      // PASO 5
      verificationCode: ['']
    });
  }

  ngOnInit(): void {
    // 1. Lógica Documento (Validación dinámica)
    this.registerForm.get('tipoDocumento')?.valueChanges.subscribe(tipo => {
      const docControl = this.registerForm.get('numeroDocumento');
      const selectedDoc = this.tiposDocumento.find(d => d.value === tipo);
      
      docControl?.setValue('');
      docControl?.markAsUntouched();
      
      if (selectedDoc) {
        docControl?.setValidators([
          Validators.required,
          Validators.maxLength(selectedDoc.length),
          Validators.pattern(selectedDoc.pattern) 
        ]);
      }
      docControl?.updateValueAndValidity();
    });

    // 2. Lógica UBIGEO (Cascada)
    // Cambio de Departamento -> Cargar Provincias
    this.registerForm.get('departamento')?.valueChanges.subscribe(dep => {
        this.provincias = [];
        this.distritos = [];
        this.registerForm.get('provincia')?.setValue('');
        this.registerForm.get('distrito')?.setValue('');

        if (dep && UBIGEO_PERU[dep]) {
            this.provincias = Object.keys(UBIGEO_PERU[dep]);
        }
    });

    // Cambio de Provincia -> Cargar Distritos
    this.registerForm.get('provincia')?.valueChanges.subscribe(prov => {
        this.distritos = [];
        this.registerForm.get('distrito')?.setValue('');
        
        const dep = this.registerForm.get('departamento')?.value;
        if (dep && prov && UBIGEO_PERU[dep] && UBIGEO_PERU[dep][prov]) {
            this.distritos = UBIGEO_PERU[dep][prov];
        }
    });
  }

  // --- NAVEGACIÓN ---

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        this.errorMessage = ''; 
        this.currentStep++;
      } else {
        this.markCurrentStepTouched();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.errorMessage = '';
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    // Validación contraseña
    if (this.currentStep === 3) {
        const pass = this.registerForm.get('password')?.value;
        const confirm = this.registerForm.get('confirmPassword')?.value;
        if (pass !== confirm) {
            this.errorMessage = 'Las contraseñas no coinciden.';
            return false;
        }
    }
    const fields = this.getFieldsForStep(this.currentStep);
    return fields.every(field => this.registerForm.get(field)?.valid);
  }

  markCurrentStepTouched() {
    const fields = this.getFieldsForStep(this.currentStep);
    fields.forEach(field => this.registerForm.get(field)?.markAsTouched());
  }

  getFieldsForStep(step: number): string[] {
    switch(step) {
      case 1: return ['tipoDocumento', 'numeroDocumento'];
      case 2: return ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'genero'];
      case 3: return ['telefonoMovil', 'email', 'password', 'confirmPassword', 'acceptTerms', 'acceptConsent'];
      case 4: return ['departamento', 'provincia', 'distrito', 'direccion']; 
      case 5: return ['verificationCode'];
      default: return [];
    }
  }

  // --- ENVÍO ---

  onSubmit() {
    this.errorMessage = '';

    // Validación simulada del código OTP
    if (this.registerForm.get('verificationCode')?.value !== '123456') {
        this.errorMessage = 'Código de verificación incorrecto.';
        return;
    }
    
    if (this.registerForm.valid) {
        this.isLoading = true; // Activar loading local
        
        const formValue = this.registerForm.value;
        
        this.authService.register(formValue).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                this.authService.saveToken(response.token);
                this.successMessage = 'Registro exitoso! Redirigiendo...';
                setTimeout(() => this.router.navigate(['/dashboard']), 2000);
            },
            error: (error: any) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Error en el servidor.';
            }
        });
    } else {
       this.registerForm.markAllAsTouched();
    }
  }
}