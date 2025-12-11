export interface MedicamentoDTO {
    medicina: string;
    dosis: string;
    indicaciones: string;
}

export interface PacienteAtencionDTO {
    idAtencion: number;
    fecha: string;
    medico: string;
    especialidad: string;

    motivoConsulta: string;
    diagnostico: string;
    tratamiento: string;

    receta: MedicamentoDTO[];
}