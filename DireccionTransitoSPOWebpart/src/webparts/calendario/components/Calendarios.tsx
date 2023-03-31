import { Dropdown, FontIcon } from "office-ui-fabric-react"
import * as React from "react"
import CSS from "./Calendario.module.scss"
import Fechas from "./Fechas"
import Dias from "./Dias"
import Meses from "./Meses"

function Calendarios (): React.ReactElement {

    const Fecha = new Date().setHours(0,0,0,0)

    const [ FechaSeleccionada, SetFechaSeleccionada] = React.useState<Date>( new Date(Fecha) )

    const [ MesSeleccionado, SetMesSeleccionado] = React.useState<number>( new Date().getMonth() ) // 0 - 11

    const [ AñoSeleccionado, SetAñoSeleccionado] = React.useState<number>( new Date().getFullYear() ) // 2022

    const ArregloMeses: string[] = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

    const Mes = ArregloMeses[MesSeleccionado]

    function MesPasado () {

        if (MesSeleccionado !== 0) SetMesSeleccionado(MesSeleccionado - 1)

        if (MesSeleccionado === 0) {

            SetMesSeleccionado(11)

            SetAñoSeleccionado(AñoSeleccionado - 1)

        }

    }

    function MesSiguiente () {

        if (MesSeleccionado !== 11) SetMesSeleccionado(MesSeleccionado + 1)

        if (MesSeleccionado === 11) {

            SetMesSeleccionado(0)

            SetAñoSeleccionado(AñoSeleccionado + 1)

        }

    }

    return (

        <>

            <div className={CSS.Mes}>

                <FontIcon onClick={MesPasado} iconName="ChevronLeft" className={CSS.Icono} />

                    { Mes + " " + AñoSeleccionado }

                <FontIcon onClick={MesSiguiente} iconName="ChevronRight" className={CSS.Icono} />

                <Meses Meses={ArregloMeses} MesSeleccionado={MesSeleccionado} SetMesSeleccionado={SetMesSeleccionado} />

            </div>

            <div className={ CSS.Calendario }>

                <Dias />

                <Fechas AñoSeleccionado={AñoSeleccionado} MesSeleccionado={MesSeleccionado} FechaSeleccionada={FechaSeleccionada} SetFechaSeleccionada={SetFechaSeleccionada} />

            </div>

        </>

    )

}

export default Calendarios