import { ChevronLeft28Regular, ChevronRight28Regular } from "@fluentui/react-icons"
import * as React from "react"
import CSS from "./Calendario.module.scss"

interface IProps {

    Meses: string[]

    MesSeleccionado: number

    SetMesSeleccionado: React.Dispatch<React.SetStateAction<number>>

    MesPasado: () => void

    MesSiguiente: () => void

    AñoSeleccionado: number,

    Mes: string,

}

function Navegacion ({ Meses, MesSeleccionado, SetMesSeleccionado, MesPasado, MesSiguiente, AñoSeleccionado, Mes }: IProps) {

    return (

        <div className={CSS.Navegacion}>

            <div className={CSS.Año}>

                <ChevronLeft28Regular onClick={MesPasado} />

                    <p style={{ width: 120, textAlign: "center" }}>

                        { Mes + " " + AñoSeleccionado }

                    </p>

                <ChevronRight28Regular onClick={MesSiguiente} />

            </div>


            <div className={CSS.Meses}>

                { Meses.map((Mes, Indice, Arreglo) => {

                    const MesAcronimo = Mes.slice(0,3)

                    const Seleccionado = MesSeleccionado === Indice

                    return(

                        <div key={Indice} onClick={() => SetMesSeleccionado(Indice)} className={CSS.ContenedorBurbuja}>
                        
                            <div className={CSS.Burbuja} aria-selected={Seleccionado}/>

                            <p className={CSS.TextoBurbuja}> { MesAcronimo } </p>

                        </div>
                        
                    )

                })}

            </div>

        </div>

    )

}

export default Navegacion