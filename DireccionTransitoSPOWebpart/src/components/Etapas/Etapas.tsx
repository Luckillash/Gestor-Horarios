import React, { ReactElement, Fragment } from "react"
import CSS from "./Etapas.module.scss"

interface IProps {

    Etapas: string[],

    Etapa: number,

    SetEtapa: React.Dispatch<React.SetStateAction<number>>

}


function Etapas ({ Etapas, Etapa, SetEtapa }: IProps ): ReactElement {


    function OnClick (Indice: number) {

        SetEtapa(Indice)

    }

    const EtapaActual = Etapas[Etapa]

    return (

        <section className={"Grid" + " " + CSS.ContenedorGeneral}>

            <div className={"FlexCentrado Gap-10"}>

                { Etapas.map((EtapaTexto, Indice, Arreglo) => {

                    const UltimoIndice: number = Arreglo.length - 1

                    const Seleccionado: boolean = Etapa === Indice

                    const EtapaAnterior: boolean = Etapa > Indice

                    return (

                        <Fragment key={Indice}>
                                
                            <button className={"Sombra BordeCircular FlexCentrado SinBorde" + " " + CSS.Burbuja} aria-selected={Seleccionado} onClick={ () => OnClick(Indice) }>

                                { EtapaAnterior ? "✔" : Indice + 1 }

                            </button>

                            { UltimoIndice !== Indice && <hr className={"Sombra SinBorde" + " " + CSS.Linea} /> }
                        
                        </Fragment>

                    )

                })}
                                
            </div>

            <h1 className={"FlexCentrado" + " " + CSS.ContenedorTexto}> { EtapaActual } </h1>

        </section>

    )

}

export default Etapas