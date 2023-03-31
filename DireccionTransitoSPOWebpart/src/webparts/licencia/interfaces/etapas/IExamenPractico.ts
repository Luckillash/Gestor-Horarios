interface IObtenerExamenPractico {

    Id: number,

    FechaExamen: string,

    HoraExamen: { Title: string, Id: number }

    Estado: string,

}

interface IExamenPractico {

    Intento: number,

    Id: number,

    FechaExamen: string,

    HoraExamen: string,

    HoraExamenId: number,

    Estado: string,

}