import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UBIGEO_PERU } from './../../../data/ubigeo.data'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  maxDate: string;
  
  // Variables visuales
  currentStep: number = 1;
  totalSteps: number = 5;
  isLoading: boolean = false;
  showPassword: boolean = false;

  // Listas
  departamentos: string[] = [];
  provincias: string[] = [];
  distritos: string[] = [];

  // Configuración de documentos
  tiposDocumento = [
    { value: 'DNI', name: 'DNI (Doc. Nacional de Identidad)', pattern: '^[0-9]{8}$', length: 8, onlyNumbers: true },
    { value: 'CE', name: 'Carnet Extranjería', pattern: '^[0-9]{12}$', length: 12, onlyNumbers: true },
    { value: 'PASAPORTE', name: 'Pasaporte', pattern: '^[a-zA-Z0-9]{6,20}$', length: 20, onlyNumbers: false }
  ];

  generos = ['MASCULINO', 'FEMENINO', 'PREFIERO_NO_DECIRLO'];

  prefijos = [
    { code: '+51', country: 'PE', flag: '🇵🇪' },
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+34', country: 'ES', flag: '🇪🇸' },
    { code: '+52', country: 'MX', flag: '🇲🇽' },
    { code: '+54', country: 'AR', flag: '🇦🇷' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+56', country: 'CL', flag: '🇨🇱' },
    { code: '+57', country: 'CO', flag: '🇨🇴' },
  ];
  selectedPrefix = '+51';

  passwordCriteria = { hasNumber: false, hasUpper: false, hasSpecial: false };

  showTermsModal = false;
  showConsentModal = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.maxDate = new Date().toISOString().split('T')[0];
    this.departamentos = Object.keys(UBIGEO_PERU);

    this.registerForm = this.fb.group({
      // PASO 1: Identificación
      tipoDocumento: ['DNI', Validators.required], 
      numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      
      // PASO 2: Datos Personales
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-ZÑÁÉÍÓÚ\s]+$/)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-ZÑÁÉÍÓÚ]+$/)]],
      apellidoMaterno: ['', [Validators.required, Validators.pattern(/^[A-ZÑÁÉÍÓÚ]+$/)]], 
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      
      // --- CONTACTO DE EMERGENCIA (Nuevos) ---
      nombreEmergencia: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-ZÑÁÉÍÓÚ\s]+$/)]],
      telefonoEmergencia: ['', [Validators.required, Validators.pattern(/^9[0-9]{8}$/)]],

      // PASO 3: Cuenta y Seguridad
      telefonoMovil: ['', [Validators.required, Validators.pattern(/^9[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]], 
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, Validators.requiredTrue],
      acceptConsent: [false, Validators.requiredTrue],

      // PASO 4: Dirección
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s.,#-]+$/)]],

      // PASO 5: OTP
      verificationCode: ['']
    });
  }

  ngOnInit(): void {
    // 1. Lógica dinámica de documentos
    this.registerForm.get('tipoDocumento')?.valueChanges.subscribe(tipo => {
      const docControl = this.registerForm.get('numeroDocumento');
      const config = this.tiposDocumento.find(d => d.value === tipo);
      
      docControl?.setValue('');
      docControl?.markAsUntouched();
      
      if (config) {
        docControl?.setValidators([
          Validators.required,
          Validators.pattern(config.pattern),
          config.onlyNumbers ? Validators.minLength(config.length) : Validators.minLength(6),
          Validators.maxLength(config.length)
        ]);
      }
      docControl?.updateValueAndValidity();
    });

    // 2. Lógica Ubigeo
    this.registerForm.get('departamento')?.valueChanges.subscribe(dep => {
        this.provincias = [];
        this.distritos = [];
        this.registerForm.get('provincia')?.setValue('');
        this.registerForm.get('distrito')?.setValue('');
        if (dep && UBIGEO_PERU[dep]) this.provincias = Object.keys(UBIGEO_PERU[dep]);
    });

    this.registerForm.get('provincia')?.valueChanges.subscribe(prov => {
        this.distritos = [];
        this.registerForm.get('distrito')?.setValue('');
        const dep = this.registerForm.get('departamento')?.value;
        if (dep && prov && UBIGEO_PERU[dep]) this.distritos = UBIGEO_PERU[dep][prov];
    });

    // 3. Análisis de contraseña
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
        this.updatePasswordCriteria(val || '');
    });
  }

  // --- Helpers de Inputs ---
  onDocumentInput(event: any) {
    const input = event.target;
    const tipo = this.registerForm.get('tipoDocumento')?.value;
    const config = this.tiposDocumento.find(d => d.value === tipo);

    if (config?.onlyNumbers) {
      input.value = input.value.replace(/[^0-9]/g, '');
    } else {
      input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }
    this.registerForm.get('numeroDocumento')?.setValue(input.value);
  }

  onPhoneInput(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
    const controlName = input.getAttribute('formControlName');
    if(controlName) this.registerForm.get(controlName)?.setValue(input.value);
  }

  toUpperCase(event: any) {
    const input = event.target;
    const value = input.value.toUpperCase();
    input.value = value;
    const controlName = input.getAttribute('formControlName');
    if (controlName) this.registerForm.get(controlName)?.setValue(value, { emitEvent: false });
  }

  checkNameSpaces(event: any) {
    const input = event.target;
    let value = input.value.toUpperCase().replace(/[^A-ZÑÁÉÍÓÚ\s]/g, '');
    const spaceCount = (value.match(/ /g) || []).length;
    
    if (spaceCount > 3 && event.data === ' ') {
       value = value.trimEnd(); 
    }
    input.value = value;
    const controlName = input.getAttribute('formControlName');
    if (controlName) this.registerForm.get(controlName)?.setValue(value, { emitEvent: false });
  }

  updatePasswordCriteria(value: string) {
    this.passwordCriteria = {
        hasNumber: /\d/.test(value),
        hasUpper: /[A-Z]/.test(value),
        hasSpecial: /[@$!%*?&._-]/.test(value)
    };
  }

  get currentDocConfig() {
    const tipo = this.registerForm.get('tipoDocumento')?.value;
    return this.tiposDocumento.find(d => d.value === tipo);
  }

  formatGender(gender: string): string {
    return gender ? gender.replace(/_/g, ' ') : '';
  }

  // Modales
  openTerms() { this.showTermsModal = true; }
  closeTerms() { this.showTermsModal = false; }
  acceptTerms() { this.registerForm.get('acceptTerms')?.setValue(true); this.closeTerms(); }

  openConsent() { this.showConsentModal = true; }
  closeConsent() { this.showConsentModal = false; }
  acceptConsent() { this.registerForm.get('acceptConsent')?.setValue(true); this.closeConsent(); }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // --- Navegación del Wizard ---
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
    if (this.currentStep === 3) {
        const pass = this.registerForm.get('password')?.value;
        const confirm = this.registerForm.get('confirmPassword')?.value;
        
        if (pass !== confirm) {
            this.errorMessage = 'Las contraseñas no coinciden.';
            return false;
        }
        if (!this.passwordCriteria.hasNumber || !this.passwordCriteria.hasUpper || !this.passwordCriteria.hasSpecial) {
            this.errorMessage = 'La contraseña debe cumplir todos los requisitos de seguridad.';
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
      // AQUÍ VALIDAMOS LOS NUEVOS CAMPOS
      case 2: return ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'genero', 'nombreEmergencia', 'telefonoEmergencia'];
      case 3: return ['telefonoMovil', 'email', 'password', 'confirmPassword', 'acceptTerms', 'acceptConsent'];
      case 4: return ['departamento', 'provincia', 'distrito', 'direccion']; 
      case 5: return ['verificationCode'];
      default: return [];
    }
  }

  // --- ENVÍO AL BACKEND ---
  onSubmit() {
    this.errorMessage = '';
    
    // Mock OTP
    if (this.registerForm.get('verificationCode')?.value !== '123456') {
        this.errorMessage = 'Código de verificación incorrecto.';
        return;
    }
    
    if (this.registerForm.valid) {
        this.isLoading = true;
        const formValues = this.registerForm.value;
        
        // === MAPEO DE DATOS PARA EL DTO DE JAVA ===
        const requestData = {
            // Credenciales y Doc
            email: formValues.email,
            password: formValues.password,
            tipoDocumento: formValues.tipoDocumento,
            numeroDocumento: formValues.numeroDocumento,
            
            // Personales
            nombres: formValues.nombres,
            apellidoPaterno: formValues.apellidoPaterno,
            apellidoMaterno: formValues.apellidoMaterno,
            fechaNacimiento: formValues.fechaNacimiento,
            genero: formValues.genero,
            telefonoMovil: formValues.telefonoMovil,
            
            // Dirección (Mapeo)
            region: formValues.departamento,        
            provincia: formValues.provincia,
            distrito: formValues.distrito,
            direccionCalle: formValues.direccion,   
            
            // Emergencia (Mapeo)
            contactoEmergenciaNombre: formValues.nombreEmergencia,
            contactoEmergenciaTelefono: formValues.telefonoEmergencia
        };
        
        this.authService.register(requestData).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                this.successMessage = 'Registro exitoso! Redirigiendo...';
                
                // Guardar token y avisar al header
                if(response.token) {
                   this.authService.saveToken(response.token);
                }

                setTimeout(() => this.router.navigate(['/']), 1500);
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