import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
  profileForm: FormGroup;
  passwordForm: FormGroup;
  emailForm: FormGroup; // <--- NUEVO FORMULARIO
  usuario: any = null;
  
  // Estados de edición
  editState = { telefono: false, direccion: false, nombreEmergencia: false, telefonoEmergencia: false };

  // Modal Password
  showPasswordModal = false;
  modalStep = 1; 
  isLoadingModal = false;
  modalError = '';
  modalSuccess = '';
  showNewPassword = false;
  passwordCriteria = { hasNumber: false, hasUpper: false, hasSpecial: false };

  // Modal Email (NUEVOS ESTADOS)
  showEmailModal = false;
  emailModalStep = 1; // 1: Nuevo Email, 2: Verificar Código
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Formulario Perfil
    this.profileForm = this.fb.group({
      nombres: [{value: '', disabled: true}],
      apellidos: [{value: '', disabled: true}],
      telefono: [{value: '', disabled: true}, [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      direccion: [{value: '', disabled: true}, Validators.required],
      dni: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      fechaRegistro: [{value: '', disabled: true}],
      nombreEmergencia: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3)]],
      telefonoEmergencia: [{value: '', disabled: true}, [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });

    // Formulario Password (ACTUALIZADO CON MINLENGTH 8)
    this.passwordForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]], 
      confirmPassword: ['', Validators.required]
    });

    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
      verificationCode: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.usuario = user;
      if (this.usuario) this.cargarDatosUsuario();
      else this.router.navigate(['/login']);
    });

    // NUEVO: Escuchar cambios en la contraseña para validar requisitos visuales
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(val => {
        this.updatePasswordCriteria(val || '');
    });
  }

  cargarDatosUsuario() {
    if (!this.usuario) return;
    const apellidos = [this.usuario.apellidoPaterno, this.usuario.apellidoMaterno].filter(Boolean).join(' ');
    let fechaStr = 'No disponible';
    if (this.usuario.fechaRegistro) fechaStr = new Date(this.usuario.fechaRegistro).toLocaleDateString();
    else if (this.usuario.iat) fechaStr = new Date(this.usuario.iat * 1000).toLocaleDateString();

    this.profileForm.patchValue({
      nombres: this.usuario.nombres || '',
      apellidos: apellidos || '',
      telefono: this.usuario.telefonoMovil || '',
      direccion: this.usuario.direccionCalle || '',
      dni: this.usuario.numeroDocumento || '',
      email: this.usuario.email || '',
      fechaRegistro: fechaStr,
      nombreEmergencia: this.usuario.contactoEmergenciaNombre || '',
      telefonoEmergencia: this.usuario.contactoEmergenciaTelefono || ''
    });
  }

  enableEdit(field: 'telefono' | 'direccion' | 'nombreEmergencia' | 'telefonoEmergencia') {
    this.editState[field] = true;
    this.profileForm.get(field)?.enable();
  }

  guardarCambios() {
    if (this.profileForm.valid) {
      const formValues = this.profileForm.getRawValue();
      const updateData = {
        telefonoMovil: formValues.telefono,
        direccionCalle: formValues.direccion,
        contactoEmergenciaNombre: formValues.nombreEmergencia,
        contactoEmergenciaTelefono: formValues.telefonoEmergencia
      };

      this.authService.updateProfile(updateData).subscribe({
        next: () => {
          alert('¡Datos actualizados correctamente!');
          this.cancelarEdicion();
        },
        error: (err) => alert('Error al actualizar datos.')
      });
    }
  }

  cancelarEdicion() {
    this.editState.telefono = false;
    this.editState.direccion = false;
    this.editState.nombreEmergencia = false;
    this.editState.telefonoEmergencia = false;
    this.profileForm.get('telefono')?.disable();
    this.profileForm.get('direccion')?.disable();
    this.profileForm.get('nombreEmergencia')?.disable();
    this.profileForm.get('telefonoEmergencia')?.disable();
  }

  openEmailModal() {
    this.showEmailModal = true;
    this.emailModalStep = 1; // Paso 1: Pedir correo
    this.modalError = '';
    this.modalSuccess = '';
    this.emailForm.reset();
  }

  closeEmailModal() {
    this.showEmailModal = false;
  }

  sendEmailCode() {
    if (this.emailForm.get('newEmail')?.invalid) return;
    
    this.isLoadingModal = true;
    this.modalError = '';
    
    // Simular envío de código al NUEVO correo
    setTimeout(() => {
      this.isLoadingModal = false;
      this.emailModalStep = 2; // Pasar a verificar código
      // Código real: 123456
    }, 1500);
  }

  verifyEmailAndSubmit() {
    const code = this.emailForm.get('verificationCode')?.value;
    const newEmail = this.emailForm.get('newEmail')?.value;

    if (code !== '123456') {
      this.modalError = 'Código incorrecto.';
      return;
    }

    this.isLoadingModal = true;
    this.authService.changeEmail(newEmail).subscribe({
      next: (res) => {
        this.isLoadingModal = false;
        this.modalSuccess = '¡Correo actualizado correctamente!';
        
        // Actualizamos visualmente el formulario principal
        this.profileForm.patchValue({ email: newEmail });
        
        setTimeout(() => this.closeEmailModal(), 2000);
      },
      error: (err) => {
        this.isLoadingModal = false;
        this.modalError = err.error?.message || 'Error al actualizar el correo.';
      }
    });
  }
  

  // --- LÓGICA MODAL PASSWORD ---
  
  openPasswordModal() {
    this.showPasswordModal = true;
    this.modalStep = 1;
    this.modalError = '';
    this.modalSuccess = '';
    this.passwordForm.reset();
    this.showNewPassword = false; // Resetear visibilidad
    this.passwordCriteria = { hasNumber: false, hasUpper: false, hasSpecial: false }; // Resetear criterios
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  // NUEVO: Funciones de UI para Password
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  updatePasswordCriteria(value: string) {
    this.passwordCriteria = {
        hasNumber: /\d/.test(value),
        hasUpper: /[A-Z]/.test(value),
        hasSpecial: /[@$!%*?&._-]/.test(value)
    };
  }

  sendCode() {
    this.isLoadingModal = true;
    this.modalError = '';
    setTimeout(() => {
      this.isLoadingModal = false;
      this.modalStep = 2; 
    }, 1500);
  }

  verifyCode() {
    const code = this.passwordForm.get('verificationCode')?.value;
    if (code === '123456') {
      this.modalError = '';
      this.modalStep = 3; 
    } else {
      this.modalError = 'Código incorrecto. Intenta con 123456.';
    }
  }

  submitNewPassword() {
    const pass = this.passwordForm.get('newPassword')?.value;
    const confirm = this.passwordForm.get('confirmPassword')?.value;

    if (pass !== confirm) {
      this.modalError = 'Las contraseñas no coinciden.';
      return;
    }

    // Validar requisitos seguros antes de enviar
    if (!this.passwordCriteria.hasNumber || !this.passwordCriteria.hasUpper || !this.passwordCriteria.hasSpecial || pass.length < 8) {
       this.modalError = 'La contraseña no cumple con los requisitos de seguridad.';
       return;
    }

    this.isLoadingModal = true;
    this.authService.changePassword(pass).subscribe({
      next: () => {
        this.isLoadingModal = false;
        this.modalSuccess = '¡Contraseña actualizada con éxito!';
        setTimeout(() => this.closePasswordModal(), 2000);
      },
      error: () => {
        this.isLoadingModal = false;
        this.modalError = 'Error al actualizar contraseña.';
      }
    });
  }
}