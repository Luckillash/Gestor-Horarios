interface ISolicitudSeleccionadaSPO {

    Id: number,

    NombreCompleto: string,

    Rut: string,

    Edad: number,

    FechaInicio: string,

    NumeroContacto: string,

    Email: string,

    Licencia: ILicencia,

    TipoSolicitud: ILookup,

    EtapaActual: IEtapa,

    EtapasSolicitud: IEtapa[],

    UsaLentes: boolean

}

interface ISolicitudSeleccionada {

    Id: number,

    NombreCompleto: string,

    Rut: string,

    Edad: number,

    FechaInicio: string,

    NumeroContacto: string,

    Licencia: ILicencia

    TipoSolicitud: string,

    EtapaActual: IEtapa,

    EtapasLicencia: IEtapa[],
    
    UsaLentes: boolean,

    Email: string
    
}

interface IResumen {

    Id: number,

    NombreCompleto: string,

    Rut: string,

    Edad: number,

    NumeroContacto: string,

    Email: string,

    FechaInicio: string,

    TipoSolicitud: string,

    Licencia: string,

    UsaLentes: string

}

interface ISolicitudEnviar {

    Nombres: string,

    Apellidos: string,

    Rut: string,

    NumeroContacto: string,

    Email: string,

    FechaNacimiento: Date,

    FechaInicio: Date,

    LicenciaId: number,

    TipoSolicitudId?: number,

    EtapaActualId: number,

    EtapasSolicitudId: number[],

    UsaLentes: boolean

}

interface ISolicitudFoto {

    Foto: File

}

interface ISolicitudDocumentacion {

    Id: number,
    
    Rut: string,

    Foto: File,

    DocumentosExtra?: File[],

}

interface IEnviarSolicitud {

    TipoSolicitudId: number[],

    LicenciaId: number[],
    
}

interface ILookup {

    Title: string,

    Id: number,
    
}