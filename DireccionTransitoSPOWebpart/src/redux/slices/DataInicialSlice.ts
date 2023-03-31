import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import * as moment from "moment"
import { DropdownMenuItemType } from "office-ui-fabric-react"
import { getSP } from "../../pnp/pnpConfig"
import { RootState } from "../store"

const initialState = {

    Solicitudes: [] as ISolicitud[],

    SolicitudesFiltradas: [] as ISolicitud[],

    Etapas: [] as IEtapa[],

    Licencias: [] as ILicencia[],

    Licencias_Opciones: [] as ILicenciaOpcion[],

    Horarios: [] as IHorario[],

    HorariosOcupados: [] as IHorariosOcupados[],

}

export const SolicitudesFiltradas_Selector = (state: RootState) => state.DataInicial.SolicitudesFiltradas

export const Solicitudes_Selector = (state: RootState) => state.DataInicial.Solicitudes

export const Licencias_Selector = (state: RootState) => state.DataInicial.Licencias

export const LicenciasOpciones_Selector = (state: RootState) => state.DataInicial.Licencias_Opciones

export const Horarios_Selector = (state: RootState) => state.DataInicial.Horarios

export const HorariosOcupados_Selector = (state: RootState) => state.DataInicial.HorariosOcupados

export const Etapas_Selector = (state: RootState) => state.DataInicial.Etapas

export const ObtenerHorarios = createAsyncThunk(

    'Licencia/ObtenerHorarios',

    async function ObtenerHorarios (): Promise<IHorario[]> {

        const SP = getSP()

        const Horarios: IHorario[] = []

        try {
            
            const HorariosSP: IHorarioSPO[] = await SP.web.lists
    
            .getByTitle("Licencia_Maestra_Horarios")
    
            .items
    
            .select("Horario,Id")
    
            ()
    
            for ( let i = 0 ; HorariosSP.length > i ; i++ ) {
    
                const { Horario, Id } = HorariosSP[i]
    
                const Formato: IHorario = {
    
                    Horario,
    
                    Id
    
                }
    
                Horarios.push(Formato)
    
            }

        } catch (error) {

            console.log(error)
            
        }

        return Horarios

    }

)

export const ObtenerHorariosOcupadosPorEtapa = createAsyncThunk(

    'Licencia/ObtenerHorariosOcupadosPorEtapa',

    async function ObtenerHorariosOcupadosPorEtapa (Filtros: { Fecha: Date, Lista: string }): Promise<IHorariosOcupados[]> {

        const { Fecha, Lista } = Filtros

        const FechaISO = new Date(Fecha).toISOString()

        const SP = getSP()

        const HorariosOcupados: IHorariosOcupados[] = []

        try {
            
            const HorariosOcupadosSPO: IHorariosOcupadosSPO[] = await SP.web.lists
    
            .getByTitle(Lista)
    
            .items
    
            .select("FechaExamen,HoraExamen/Title,HoraExamen/Id,Solicitud/NombreCompleto,Id")
    
            .expand("HoraExamen,Solicitud")
    
            .filter(`FechaExamen ge datetime'${FechaISO}' and FechaExamen le datetime'${FechaISO}'`)
            
            ()

            for ( let i = 0 ; HorariosOcupadosSPO.length > i ; i++ ) {
    
                const { HoraExamen, FechaExamen, Solicitud, Id } = HorariosOcupadosSPO[i];
    
                const { Title } = HoraExamen
    
                const { NombreCompleto } = Solicitud
    
                const Formato: IHorariosOcupados = {

                    Id: Id,
    
                    Nombre: NombreCompleto,
    
                    HoraExamen: Title,
    
                    HoraExamenId: HoraExamen.Id,
    
                    FechaExamen: FechaExamen
                    
                }
    
                HorariosOcupados.push(Formato)
                
            }

        } catch (error) {

            console.log(error)
            
        }

        return HorariosOcupados

    }

)

export const ObtenerEtapas = createAsyncThunk(

    'Licencia/ObtenerEtapas',

    async function ObtenerEtapas (): Promise<IEtapa[]> {

        const SP = getSP()

        const Etapas: IEtapa[] = []

        try {
            
            const EtapasSP: IEtapaSPO[] = await SP.web.lists
    
            .getByTitle("Licencia_Maestra_Etapas")
    
            .items
    
            .select("Etapa, Id")
    
            ()
    
            for ( let i = 0 ; EtapasSP.length > i ; i++ ) {
    
                const { Etapa, Id } = EtapasSP[i]
    
                const Formato: IEtapa = {

                    Id,                    
    
                    Etapa,
    
                }
    
                Etapas.push(Formato)
    
            }

        } catch (error) {

            console.log(error)
            
        }

        return Etapas

    }

)

export const ObtenerLicencias = createAsyncThunk(

    'Licencia/ObtenerLicencias',

    async function ObtenerLicencias (): Promise<{ Licencias: ILicencia[], Opciones: ILicenciaOpcion[] }> {

        const SP = getSP()

        const Licencias: ILicencia[] = []

        const Opciones: ILicenciaOpcion[] = []

        try {
            
            const LicenciasSP: ILicenciaSPO[] = await SP.web.lists
    
            .getByTitle("Licencia_Maestra_Licencias")
    
            .items
    
            .select("Id,Licencia,TipoLicencia")
    
            ()
    
            let TipoLicenciaAnterior: string
    
            for ( let i = 0 ; LicenciasSP.length > i ; i++ ) {
    
                const { Id, Licencia, TipoLicencia } = LicenciasSP[i];
    
                const FormatoLicencias: ILicencia = {
    
                    Id,
    
                    Licencia,
    
                    TipoLicencia
    
                }
    
                Licencias.push(FormatoLicencias)
    
                if (TipoLicencia !== TipoLicenciaAnterior) {
    
                    TipoLicenciaAnterior = TipoLicencia
    
                    const FormatoSeparador: ILicenciaOpcion = {
    
                        key: 0,
    
                        text: TipoLicencia,
    
                        itemType: DropdownMenuItemType.Header
    
                    }
    
                    Opciones.push(FormatoSeparador)
    
                }
                
                const FormatoOpciones: ILicenciaOpcion = {
    
                    key: Id,
    
                    text: "Clase " + Licencia
    
                }
    
                Opciones.push(FormatoOpciones)
    
            }

        } catch (error) {

            console.log(error)
            
        }

        return {

            Licencias: Licencias,

            Opciones: Opciones

        }

    }

)

export const ObtenerSolicitudes = createAsyncThunk(

    'Licencia/ObtenerSolicitudes',

    async function ObtenerSolicitudes (): Promise<ISolicitud[]> {

        const SP = getSP()

        const Solicitudes: ISolicitud[] = []

        try {
            
            const SolicitudesSP: ISolicitudSPO[] = await SP.web.lists
    
            .getByTitle("Licencia_Hechos_Solicitudes")
    
            .items
    
            .select("Id,NombreCompleto,Rut,Edad,FechaInicio,NumeroContacto,Licencia/Licencia,TipoSolicitud/Title,EtapaActual/Etapa,UsaLentes")
    
            .expand("TipoSolicitud,EtapaActual,Licencia")
    
            ()
    
            for(let i = 0 ; SolicitudesSP.length > i ; i++) {
    
                const { Id, NombreCompleto, Rut, Edad, FechaInicio, TipoSolicitud, EtapaActual, Licencia, NumeroContacto, UsaLentes } = SolicitudesSP[i]
    
                const FormatoEtapa: IEtapa = {

                    Etapa: EtapaActual.Etapa,

                    Id: EtapaActual.Id

                }

                const FormatoLicencia: ILicencia = {

                    Licencia: Licencia.Licencia,

                    Id: Licencia.Id

                }

                const Formato: ISolicitud = {
    
                    Id: Id,
    
                    NombreCompleto: NombreCompleto,
    
                    Rut: Rut,
    
                    Edad: Edad,
    
                    FechaInicio: moment(new Date(FechaInicio)).format("DD/MM/YYYY"),
    
                    NumeroContacto: NumeroContacto,
    
                    Licencia: FormatoLicencia,
    
                    TipoSolicitud: TipoSolicitud.Title,
    
                    EtapaActual: FormatoEtapa,
    
                    UsaLentes: UsaLentes,
    
                }
    
                Solicitudes.push(Formato)
    
            }

        } catch (error) {

            console.log(error)
            
        }

        return Solicitudes
    
    }

)

export const DataInicialSlice = createSlice({

    name: 'DataInicial',
    
    initialState,

    reducers: { 

        FiltrarGrillaSolicitudes: (state, action: PayloadAction<IFiltroSolicitud>) => {

            const { Id, Nombre, Rut } = action.payload

            if (Id === "" && Nombre === "" && Rut === "") {

                state.SolicitudesFiltradas = state.Solicitudes

                return

            }

            const SolicitudesFiltradas = state.Solicitudes.filter((Solicitud) => {

                const IncluyeId = Solicitud.Id.toString().includes(Id)

                const IncluyeNombre = Solicitud.NombreCompleto.includes(Nombre)

                const IncluyeRut = Solicitud.Rut.includes(Rut)

                if (Id !== "" && !IncluyeId) return false

                if (Nombre !== "" && !IncluyeNombre) return false

                if (Rut !== "" && !IncluyeRut) return false

                return true

            })

            if (SolicitudesFiltradas.length > 0) state.SolicitudesFiltradas = SolicitudesFiltradas

            if (SolicitudesFiltradas.length === 0) state.SolicitudesFiltradas = []

        },

        PaginarGrillaSolicitudes: (state, action: PayloadAction<number>) => {

            const Pagina = action.payload

            const Inicio = (8 * Pagina) - 8;

            const Fin = Inicio + 8;
    
            state.SolicitudesFiltradas = state.SolicitudesFiltradas.slice(Inicio, Fin);

        }

    },



    extraReducers: (builder) => {

        builder

        //#region Horarios

        .addCase(ObtenerHorarios.pending, (state) => {

        })
        
        .addCase(ObtenerHorarios.fulfilled, (state, action) => {
        
            state.Horarios = action.payload

        }) 
        
        .addCase(ObtenerHorarios.rejected, (state) => {
        
        })  

        //#endregion

        //#region Horarios ocupados por etapa

        .addCase(ObtenerHorariosOcupadosPorEtapa.pending, (state) => {

        })

        .addCase(ObtenerHorariosOcupadosPorEtapa.fulfilled, (state, action) => {

            state.HorariosOcupados = action.payload;

        }) 

        .addCase(ObtenerHorariosOcupadosPorEtapa.rejected, (state) => {

        })  

        //#endregion

        //#region Solicitudes

        .addCase(ObtenerSolicitudes.pending, (state) => {

        })

        .addCase(ObtenerSolicitudes.fulfilled, (state, action) => {

            state.Solicitudes = action.payload

            state.SolicitudesFiltradas = action.payload

        }) 

        .addCase(ObtenerSolicitudes.rejected, (state) => {

        })

        //#endregion

        //#region Etapas

        .addCase(ObtenerEtapas.pending, (state) => {

        })

        .addCase(ObtenerEtapas.fulfilled, (state, action) => {

            state.Etapas = action.payload

        }) 

        .addCase(ObtenerEtapas.rejected, (state) => {

        })  

        //#endregion

        //#region Licencias

        .addCase(ObtenerLicencias.pending, (state) => {

        })

        .addCase(ObtenerLicencias.fulfilled, (state, action) => {

            const { Licencias, Opciones } = action.payload

            state.Licencias = Licencias

            state.Licencias_Opciones = Opciones

        }) 

        .addCase(ObtenerLicencias.rejected, (state) => {

        })  

        //#endregion

    }

})

export const { FiltrarGrillaSolicitudes, PaginarGrillaSolicitudes } = DataInicialSlice.actions

export default DataInicialSlice.reducer


