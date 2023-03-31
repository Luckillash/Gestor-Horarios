import { DatePicker, FontIcon, IDatePicker } from "office-ui-fabric-react"
import * as React from "react"
import Calendario from "../Calendario/Calendario"
import CSS from "./AgendarFecha.module.scss"
import PanelExamenTeorico from "./PanelAgendarFecha"

interface IProps {

    EtapaActual: string

}

function AgendarFecha ({ EtapaActual }: IProps ): React.ReactElement {

    const [ MostrarCalendario, setMostrarCalendario ] = React.useState<boolean>(false)

    const [ MostrarPanel , SetMostrarPanel ] = React.useState<boolean>(false)
    
    const [ Fecha, setFecha ] = React.useState<Date>()

    function SeleccionarFecha (fecha: Date): void {

        setFecha(fecha)

        SetMostrarPanel(true)

    }

    const Etapa = EtapaActual.toLowerCase()

    return (

        <div className={CSS.Contenedor}>

            { !MostrarCalendario &&

                <>
                
                    <FontIcon iconName="Add" className={CSS.Icono} />

                    <button onClick={() => setMostrarCalendario(true)} className={CSS.Boton}>Agendar { Etapa }</button>

                </>

            }

            { MostrarCalendario && <Calendario ManejarFecha={SeleccionarFecha} /> }

            { MostrarPanel && <PanelExamenTeorico MostrarPanel={MostrarPanel} SetMostrarPanel={SetMostrarPanel} Fecha={Fecha} Cabecera={"Fechas disponibles"} /> }

        </div>
        
    )

}

export default AgendarFecha