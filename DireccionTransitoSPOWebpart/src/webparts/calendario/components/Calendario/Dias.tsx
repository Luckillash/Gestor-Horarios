import * as React from "react"
import CSS from "./Calendario.module.scss"

function Dias (): React.ReactElement {

    const DiasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

    return (

        <>
        
            { DiasSemana.map((Dia, Indice, Arreglo) => {



                return (

                    <span key={Indice} className={ CSS.Dia } style={{ 
                        
                        borderRadius: Indice === 0 ? "4px 0px 0px 0px" : Indice === 6 ? "0px 4px 0px 0px" : "none" ,

                    }}
                    
                    >
                            
                        { Dia }
                        
                    </span>

                )

            })}

        </>

    )

}

export default Dias