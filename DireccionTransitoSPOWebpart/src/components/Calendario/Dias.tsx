import * as React from "react"
import CSS from "./Calendario.module.scss"

function Dias (): React.ReactElement {

    const DiasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

    return (

        <div className={ CSS.Dias }>
        
            { DiasSemana.map((Dia, Indice, Arreglo) => {

                return (

                    <span key={Indice} className={ CSS.Dia } aria-colindex={Indice}>
                            
                        { Dia }
                        
                    </span>

                )

            })}

        </div>

    )

}

export default Dias