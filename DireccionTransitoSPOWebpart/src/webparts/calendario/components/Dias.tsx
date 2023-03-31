import * as React from "react"
import CSS from "./Calendario.module.scss"

function Dias (): React.ReactElement {

    const DiasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

    return (

        <>
        
            { DiasSemana.map((Dia, Indice, Arreglo) => {

                return (

                    <span className={ CSS.Dia }>{ Dia }</span>

                )

            })}

        </>

    )

}

export default Dias