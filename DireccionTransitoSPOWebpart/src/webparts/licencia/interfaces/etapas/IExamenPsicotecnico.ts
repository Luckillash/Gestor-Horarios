interface IObtenerExamenPsicotecnico {

    Id: number,

    FechaExamen: string,

    HoraExamen: { Title: string, Id: number }

    Estado: string,

}

interface IExamenPsicotecnico {

    Intento: number,

    Id: number,

    FechaExamen: string,

    HoraExamen: string,

    HoraExamenId: number,

    Estado: string,

}