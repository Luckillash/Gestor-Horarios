import * as React from "react"

interface IProps {

    Meses: string[],

    MesSeleccionado: number

    SetMesSeleccionado: React.Dispatch<React.SetStateAction<number>>

}

function Meses ({ Meses, MesSeleccionado, SetMesSeleccionado }: IProps): React.ReactElement {

    return (

        <div style={{ display: "flex", flexBasis: "20px", gap: "20px" }}>

            { Meses.map((Mes, Indice, Arreglo) => {

                const Mes3Letras = Mes.slice(0,3)

                return(

                    <div onClick={() => SetMesSeleccionado(Indice)} style={{ width: "20px", height: "30px"}}>
                    
                        <div style={{ width: "20px", height: "20px", borderRadius: "100%", backgroundColor: MesSeleccionado === Indice ? "Green" : "Blue" }}>

                        </div>

                        <p style={{ width: "20px", height: "10px", margin: "0px" }}>{Mes3Letras}</p>

                    </div>
                    
                )

            })}

        </div>

    )

}

export default Meses