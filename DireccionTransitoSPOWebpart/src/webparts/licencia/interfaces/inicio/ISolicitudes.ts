interface ISolicitudSPO {  

    Id: number,

    NombreCompleto: string,

    Rut: string,

    Edad: number,

    FechaInicio: string,

    NumeroContacto: string,

    Licencia: ILicencia

    TipoSolicitud: ILookup,

    EtapaActual: IEtapa,

    UsaLentes: boolean,

}

interface ISolicitud {

    Id: number,

    NombreCompleto: string,

    Rut: string,

    Edad: number,

    FechaInicio: string,

    NumeroContacto: string,

    Licencia: ILicencia

    TipoSolicitud: string,

    EtapaActual: IEtapa,
    
    UsaLentes: boolean,

}

interface IFiltroSolicitud {

    Id: string,

    Rut: string, 

    Nombre: string,

}

interface ILookup {

    Title: string,

    Id: number,
    
}

