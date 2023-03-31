type IEstado = "Inactivo" | "Error" | "Cargando" | "Finalizado"

interface IEstadosIniciales {

    Estado_Horarios: IEstado,

    Estado_Etapas: IEstado,

    Estado_Licencias: IEstado,

    Estado_Solicitudes: IEstado,

}

interface IEstadosSolicitud {

    Estado_Solicitud: IEstado,

    Estado_Documentos: IEstado,

    Estado_ExamenTeorico: IEstado

    Estado_ExamenPsicotecnico: IEstado,

    Estado_ExamenPractico: IEstado,

}

