import * as React from "react"
import CSS from "./Calendario.module.scss"
import Fechas from "./Fechas"
import Dias from "./Dias"
import { ReactElement, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { TraerHorariosExamenTeorico, TraerHorariosExamenPsicotecnico, TraerHorariosExamenPractico, MostrarCargando } from "../CalendarioSliceReducer"
import Loading from "../../../components/Loading/Loading"
import Navegacion from "./Navegacion"
import { Panel, PanelType } from "office-ui-fabric-react"
import PanelExamenes from "./PanelExamenes"

interface IProps {

    ManejarFecha: (Fecha: Date) => void,

}

function Calendario ({ ManejarFecha }: IProps): ReactElement {

    const Dispatch = useAppDispatch()

    const Fecha = new Date().setHours(0,0,0,0)

    const [ FechaSeleccionada, SetFechaSeleccionada] = useState<Date>( new Date(Fecha) )

    const [ MesSeleccionado, SetMesSeleccionado] = useState<number>( new Date().getMonth() ) // 0 - 11

    const [ AñoSeleccionado, SetAñoSeleccionado] = useState<number>( new Date().getFullYear() ) // 2022

    const [ Cargando, SetCargando ] = useState(true)

    const [ MostrarPanel, SetMostrarPanel ] = useState<boolean>(false)

    const Meses: string[] = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

    const Mes = Meses[MesSeleccionado]

    async function MesPasado () {

        await Dispatch(MostrarCargando(true))

        let NuevoMes = MesSeleccionado

        let NuevoAño = AñoSeleccionado

        if (MesSeleccionado !== 0) {

            NuevoMes--

            SetMesSeleccionado(NuevoMes)

        }

        if (MesSeleccionado === 0) {

            NuevoMes = 11

            NuevoAño--

            SetMesSeleccionado(NuevoMes)

            SetAñoSeleccionado(NuevoAño)

        }

        const Parametros = {

            Año: NuevoAño,

            Mes: NuevoMes

        }

        await Dispatch(TraerHorariosExamenTeorico(Parametros))

        await Dispatch(TraerHorariosExamenPsicotecnico(Parametros))

        await Dispatch(TraerHorariosExamenPractico(Parametros))

        await Dispatch(MostrarCargando(false))

    }

    async function MesSiguiente () {

        await Dispatch(MostrarCargando(true))

        let NuevoMes = MesSeleccionado

        let NuevoAño = AñoSeleccionado

        if (MesSeleccionado !== 11) { 

            NuevoMes++
            
            SetMesSeleccionado(NuevoMes)

        }

        if (MesSeleccionado === 11) {

            NuevoMes = 0

            NuevoAño++

            SetMesSeleccionado(NuevoMes)

            SetAñoSeleccionado(NuevoAño)

        }

        const Parametros = {

            Año: NuevoAño,

            Mes: NuevoMes

        }

        await Dispatch(TraerHorariosExamenTeorico(Parametros))

        await Dispatch(TraerHorariosExamenPsicotecnico(Parametros))

        await Dispatch(TraerHorariosExamenPractico(Parametros))

        await Dispatch(MostrarCargando(false))

    }

    async function Inicio () {

        const Parametros = {

            Año: AñoSeleccionado,

            Mes: MesSeleccionado

        }

        await Dispatch(TraerHorariosExamenTeorico(Parametros))

        await Dispatch(TraerHorariosExamenPsicotecnico(Parametros))

        await Dispatch(TraerHorariosExamenPractico(Parametros))

        SetCargando(false)

    }

    useEffect(() => {

        Inicio()

    }, [])

    if (Cargando) return (

        <div>

            <Loading Ajustar={"Ajustar"} />

        </div>

    )

    return (

        <main className={CSS.Contenido}>

            <div className={CSS.Calendario}>

                <Navegacion Meses={Meses} MesSeleccionado={MesSeleccionado} SetMesSeleccionado={SetMesSeleccionado} MesPasado={MesPasado} MesSiguiente={MesSiguiente} Mes={Mes} AñoSeleccionado={AñoSeleccionado} />

                <Dias />

                <Fechas AñoSeleccionado={AñoSeleccionado} MesSeleccionado={MesSeleccionado} FechaSeleccionada={FechaSeleccionada} SetFechaSeleccionada={SetFechaSeleccionada} ManejarFecha={ManejarFecha} SetMostrarPanel={SetMostrarPanel} MostrarPanel={MostrarPanel} />

            </div>

            <PanelExamenes MostrarPanel={MostrarPanel} SetMostrarPanel={SetMostrarPanel} />

        </main>

    )

}

export default Calendario