import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../redux/store'
import { getSP } from '../../pnp/pnpConfig'

const initialState = {

    Cargando: false as boolean,

    ExamenesTeoricos: [] as IExamen[],

    ExamenesPsicotecnico: [] as IExamen[],
    
    ExamenPractico: [] as IExamen[],

    Panel: {

        ExamenesTeoricos: [] as IExamen[],

        ExamenesPsicotecnico: [] as IExamen[],
        
        ExamenPractico: [] as IExamen[],

    }

}

export const Cargando_Selector = (state: RootState) => state.Calendario.Cargando

export const FechasExamenTeorico_Selector = (state: RootState) => state.Calendario.ExamenesTeoricos

export const FechasExamenPsicotecnico_Selector = (state: RootState) => state.Calendario.ExamenesPsicotecnico

export const FechasExamenPractico_Selector = (state: RootState) => state.Calendario.ExamenPractico

export const PanelExamenTeorico_Selector = (state: RootState) => state.Calendario.Panel.ExamenesTeoricos

export const PanelExamenPsicotecnico_Selector = (state: RootState) => state.Calendario.Panel.ExamenesPsicotecnico

export const PanelExamenPractico_Selector = (state: RootState) => state.Calendario.Panel.ExamenPractico

export const TraerHorariosExamenTeorico = createAsyncThunk(

    'Calendario/TraerHorariosExamenTeorico',

    async function TraerHorariosExamenTeorico (Filtros: { Año: number, Mes: number }): Promise<IExamen[]> {

        const { Año, Mes } = Filtros

        const PrimeraFechaISO = new Date(Año, Mes, 1).toISOString()

        const UltimaFechaISO = new Date(Año, Mes + 1, 0).toISOString()

        console.log(PrimeraFechaISO,UltimaFechaISO)

        const SP = getSP()

        const Data: IExamen[] = []

        const Horarios = await SP.web.lists

        .getByTitle("Licencia_Etapa_ExamenTeorico")

        .items

        .select("Solicitud/NombreCompleto,FechaExamen,HoraExamen/Title")

        .expand("Solicitud,HoraExamen")

        .filter(`FechaExamen ge datetime'${PrimeraFechaISO}' and FechaExamen le datetime'${UltimaFechaISO}'`)

        ()

        for (let i = 0; i < Horarios.length; i++) {

            const Horario = Horarios[i];
            
            const { FechaExamen, HoraExamen, Solicitud } = Horario

            const { Title } = HoraExamen

            const { NombreCompleto } = Solicitud

            const FechaFormateada = new Date(FechaExamen).toLocaleDateString("es-ES", {

                day: '2-digit',

                month: '2-digit',

                year: 'numeric'

            })

            const Formato = {

                FechaExamenCompleta: FechaFormateada,

                FechaExamen: new Date(FechaExamen).getDate(),

                HoraExamen: Title,

                NombreCompleto

            }

            Data.push(Formato)
            
        }

        return Data

    }

)

export const TraerHorariosExamenPsicotecnico = createAsyncThunk(

    'Calendario/TraerHorariosPsicotecnico',

    async function TraerHorariosPsicotecnico (Filtros: { Año: number, Mes: number }): Promise<IExamen[]> {

        const { Año, Mes } = Filtros

        const PrimeraFechaISO = new Date(Año, Mes, 1).toISOString()

        const UltimaFechaISO = new Date(Año, Mes + 1, 0).toISOString()

        const SP = getSP()

        const Data: IExamen[] = []

        const Horarios = await SP.web.lists

        .getByTitle("Licencia_Etapa_ExamenPsicotecnico")

        .items

        .select("Solicitud/NombreCompleto,FechaExamen,HoraExamen/Title")

        .expand("Solicitud,HoraExamen")

        .filter(`FechaExamen ge datetime'${PrimeraFechaISO}' and FechaExamen le datetime'${UltimaFechaISO}'`)

        ()

        for (let i = 0; i < Horarios.length; i++) {

            const Horario = Horarios[i];
            
            const { FechaExamen, HoraExamen, Solicitud } = Horario

            const { Title } = HoraExamen

            const { NombreCompleto } = Solicitud

            const FechaFormateada = new Date(FechaExamen).toLocaleDateString("es-ES", {

                day: '2-digit',

                month: '2-digit',

                year: 'numeric'

            })

            const Formato = {

                FechaExamenCompleta: FechaFormateada,

                FechaExamen: new Date(FechaExamen).getDate(),

                HoraExamen: Title,

                NombreCompleto

            }

            Data.push(Formato)
            
        }

        return Data

    }

)

export const TraerHorariosExamenPractico = createAsyncThunk(

    'Calendario/TraerHorariosExamenPractico',

    async function TraerHorariosExamenPractico (Filtros: { Año: number, Mes: number }): Promise<IExamen[]> {

        const { Año, Mes } = Filtros

        const PrimeraFechaISO = new Date(Año, Mes, 1).toISOString()

        const UltimaFechaISO = new Date(Año, Mes + 1, 0).toISOString()

        const SP = getSP()

        const Data: IExamen[] = []

        const Horarios = await SP.web.lists

        .getByTitle("Licencia_Etapa_ExamenPractico")

        .items
        
        .select("Solicitud/NombreCompleto,FechaExamen,HoraExamen/Title")

        .expand("Solicitud,HoraExamen")

        .filter(`FechaExamen ge datetime'${PrimeraFechaISO}' and FechaExamen le datetime'${UltimaFechaISO}'`)

        ()

        for (let i = 0; i < Horarios.length; i++) {

            const Horario = Horarios[i];
            
            const { FechaExamen, HoraExamen, Solicitud } = Horario

            const { Title } = HoraExamen

            const { NombreCompleto } = Solicitud

            const FechaFormateada = new Date(FechaExamen).toLocaleDateString("es-ES", {

                day: '2-digit',

                month: '2-digit',

                year: 'numeric'

            })

            const Formato = {

                FechaExamenCompleta: FechaFormateada,

                FechaExamen: new Date(FechaExamen).getDate(),

                HoraExamen: Title,

                NombreCompleto

            }
            
            Data.push(Formato)
            
        }

        return Data

    }

)

export const CalendarioSlice = createSlice({

    name: 'Calendario',
    
    initialState, // `createSlice` infiere el type del state a través del initialState.

    reducers: { // Acá van las acciones.

        MostrarCargando: (state, action: PayloadAction<boolean>) => {

            state.Cargando = action.payload

        },

        AjustarExamenTeorico: (state, action: PayloadAction<IExamen[]>) => {

            state.Panel.ExamenesTeoricos = action.payload

        },

        AjustarExamenPsicotecnico: (state, action: PayloadAction<IExamen[]>) => {

            state.Panel.ExamenesPsicotecnico = action.payload

        },

        AjustarExamenPractico: (state, action: PayloadAction<IExamen[]>) => {

            state.Panel.ExamenPractico = action.payload

        },

    },

    extraReducers: (builder) => {

        builder

        //#region Examen téorico

        .addCase(TraerHorariosExamenTeorico.pending, (state) => {

        })
        
        .addCase(TraerHorariosExamenTeorico.fulfilled, (state, action) => {

            state.ExamenesTeoricos = action.payload
        
        }) 
        
        .addCase(TraerHorariosExamenTeorico.rejected, (state) => {
        
        })  

        //#endregion

        //#region Examen psicotécnico

        .addCase(TraerHorariosExamenPsicotecnico.pending, (state) => {

        })
        
        .addCase(TraerHorariosExamenPsicotecnico.fulfilled, (state, action) => {

            state.ExamenesPsicotecnico = action.payload
        
        }) 
        
        .addCase(TraerHorariosExamenPsicotecnico.rejected, (state) => {
        
        })  

        //#endregion

        //#region Examen práctico

        .addCase(TraerHorariosExamenPractico.pending, (state) => {

        })
        
        .addCase(TraerHorariosExamenPractico.fulfilled, (state, action) => {

            state.ExamenPractico = action.payload
        
        }) 
        
        .addCase(TraerHorariosExamenPractico.rejected, (state) => {
        
        })  

        //#endregion

    },

})

export const { MostrarCargando, AjustarExamenTeorico, AjustarExamenPsicotecnico, AjustarExamenPractico,  } = CalendarioSlice.actions

export default CalendarioSlice.reducer

