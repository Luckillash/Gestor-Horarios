interface IExamenTeoricoSPO {

    Id: number,

    FechaExamen: string,

    HoraExamen: { Title: string, Id: number }

    Aprobado: boolean,

    Correctas: number,

    Incorrectas: number,

    PuntajePorcentual: string

    Estado: any

}

interface IExamenTeorico {

    Intento: number,

    Id: number,

    FechaExamen: string,
    
    HoraExamen: string,

    HoraExamenId: number,

    Correctas: number,

    Incorrectas: number,

    PuntajePorcentual: string

    Estado: any
    
}