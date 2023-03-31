interface IHorariosOcupadosSPO {

    Id: number,

    Solicitud: {

        NombreCompleto: string

    }

    FechaExamen: string,

    HoraExamen: ILookup

}

interface IHorariosOcupados {

    Id: number,

    Nombre: string,

    FechaExamen: string

    HoraExamen: string,

    HoraExamenId: number,

}

interface ISubirHorario {

    Lista: string,

    IdSolicitudId: number,

    FechaExamen: Date,

    HoraExamenId: number,
    
}

interface ILookup {

    Title: string,

    Id: number,
    
}