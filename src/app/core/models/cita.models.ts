export interface CitaRequest {
    medicoId: number;
    fechaHora: string; // LocalDateTime en formato ISO ('2025-10-28T10:00:00')
    modalidadId: number;

    // Datos para terceros
    esParaTercero?: boolean;
    pacienteNombre?: string;
    pacienteDni?: string;
    pacienteTelefono?: string;

    // Triaje previo (Opcional al agendar)
    motivoConsulta?: string;
    peso?: number;
    altura?: number;
    alergias?: string;
    antecedentes?: string;
}

export interface CitaResponse {
    id: number;
    fechaHora: string;
    modalidad: string;
    estado: string;
    nombreMedico: string;
    especialidad: string;

    nombrePaciente: string;
    dniPaciente: string;
    motivoConsulta: string;

    precio: number;
    estadoPago: string;
    linkReunion?: string;
}

// Para la atención médica (Historia Clínica)
export interface DetalleRecetaDTO {
    medicamento: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
}

export interface AtencionRequest {
    idCita: number;
    motivoConsulta: string;
    exploracionFisica?: string;

    // Signos Vitales
    temperatura?: number;
    frecuenciaCardiaca?: number;
    frecuenciaRespiratoria?: number;
    saturacionOxigeno?: number;
    peso?: number;
    talla?: number;
    presionArterial?: string;

    // Diagnóstico
    diagnosticoPresuntivo: string;
    diagnosticoDefinitivo?: string;
    codigoCie10?: string;

    // Tratamiento
    planTratamiento: string;
    pronostico?: string;

    medicamentos?: DetalleRecetaDTO[];
}