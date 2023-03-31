interface ILicenciaSPO {

    Id: number,

    Licencia: string

    TipoLicencia: string

}   

interface ILicencia {

    Id: number,

    Licencia: string

    TipoLicencia?: string

}

 interface ILicenciaOpcion {

    key: number

    text: string

    itemType?: any

}