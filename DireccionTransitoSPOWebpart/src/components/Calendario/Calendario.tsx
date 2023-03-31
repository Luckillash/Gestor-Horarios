import * as React from "react"
import CSS from "./Calendario.module.scss"
import Fechas from "./Fechas"
import Dias from "./Dias"
import { ReactElement, useEffect, useState } from "react"
import Navegacion from "./Navegacion"
import Loading from "../Loading/Loading"

interface IProps {

    ManejarFecha?: (Fecha: Date) => void,

}

function Calendario ({ ManejarFecha }: IProps): ReactElement {

    const Fecha = new Date().setHours(0,0,0,0)

    const [ FechaSeleccionada, SetFechaSeleccionada] = useState<Date>( new Date(Fecha) )

    const [ MesSeleccionado, SetMesSeleccionado] = useState<number>( new Date().getMonth() ) // 0 - 11

    const [ AñoSeleccionado, SetAñoSeleccionado] = useState<number>( new Date().getFullYear() ) // 2022

    const Meses: string[] = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

    const Mes = Meses[MesSeleccionado]

    async function MesPasado () {

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

    }

    async function MesSiguiente () {

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

    }

    return (

        <main className={CSS.Contenido}>

            <div className={CSS.Calendario}>

                <Navegacion Meses={Meses} MesSeleccionado={MesSeleccionado} SetMesSeleccionado={SetMesSeleccionado} MesPasado={MesPasado} MesSiguiente={MesSiguiente} Mes={Mes} AñoSeleccionado={AñoSeleccionado} />

                <Dias />

                <Fechas AñoSeleccionado={AñoSeleccionado} MesSeleccionado={MesSeleccionado} FechaSeleccionada={FechaSeleccionada} SetFechaSeleccionada={SetFechaSeleccionada} ManejarFecha={ManejarFecha} />

            </div>

        </main>

    )

}

export default Calendario