import * as React from "react"
import CSS from "./Calendario.module.scss"

interface IProps {

    Meses: string[],

    MesSeleccionado: number

    SetMesSeleccionado: React.Dispatch<React.SetStateAction<number>>

}

function Meses ({ Meses, MesSeleccionado, SetMesSeleccionado }: IProps): React.ReactElement {

    return (

        <div className={CSS.Meses}>

            { Meses.map((Mes, Indice, Arreglo) => {

                const Mes3Letras = Mes.slice(0,3)

                return(

                    <div key={Indice} onClick={() => SetMesSeleccionado(Indice)} className={CSS.ContenedorBurbuja} >
                    
                        <div className={CSS.Burbuja} style={{ backgroundColor: MesSeleccionado === Indice ? "#ff47a1" : "#ff9f4d" }} />

                        <p className={CSS.TextoBurbuja} > { Mes3Letras } </p>

                    </div>
                    
                )

            })}

        </div>

    )

}

export default Meses