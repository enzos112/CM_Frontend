export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    // Credenciales
    email: string;
    password: string;

    // Datos Personales
    tipoDocumento: string;
    numeroDocumento: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno?: string; // Opcional
    fechaNacimiento: string; // Formato 'YYYY-MM-DD'
    genero: string;
    telefonoMovil: string;

    // Dirección (Opcionales en tu Backend)
    region?: string;      // En el form es 'departamento'
    provincia?: string;
    distrito?: string;
    direccionCalle?: string; // En el form es 'direccion'

    // Emergencia (Opcionales en tu Backend)
    contactoEmergenciaNombre?: string;   // En el form es 'nombreEmergencia'
    contactoEmergenciaTelefono?: string; // En el form es 'telefonoEmergencia'
}

export interface AuthResponse {
    token: string;
}