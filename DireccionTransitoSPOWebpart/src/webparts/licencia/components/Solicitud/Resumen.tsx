import * as React from "react"
import CSS from "../Licencia.module.scss"
import { useAppSelector } from "../../../../redux/hooks";
import { FotoPerfil, Resumen_Selector } from "../../../../redux/slices/LicenciaSlice";
import { DefaultButton, getTheme } from "office-ui-fabric-react";
import Documentos from "./Documentos";

const temaSPO = getTheme()

const primario = temaSPO.palette.themePrimary

function ResumenSolicitud (): React.ReactElement {

    const Resumen: IResumen = useAppSelector(Resumen_Selector)

	const { Ruta, Nombre }: IDocumentos = useAppSelector(FotoPerfil);

    const Propiedades: any[] = []

    for (const Propiedad in Resumen) {

        if (Resumen.hasOwnProperty(Propiedad)) {

          Propiedades.push({ Propiedad: Propiedad, Valor: Resumen[Propiedad as keyof IResumen] });

        }

    }

    return (

        <div className={CSS.ContenedorResumen}>

            <div className={CSS.ContenedorCentradoBordado}>

                <div className={CSS.ContenedorIzquierdo}>

                    { Propiedades.map(({ Propiedad, Valor }, Indice, Arreglo) => {

                        let PropiedadFormateada: string

                        const [PrimeraPalabra, SegundaPalabra] = Propiedad.split(/(?=[A-Z])/);

                        if(!SegundaPalabra) PropiedadFormateada = PrimeraPalabra

                        if (SegundaPalabra) PropiedadFormateada = PrimeraPalabra + " " + SegundaPalabra

                        PropiedadFormateada = PropiedadFormateada.toUpperCase()

                        return ( 

                            <p className={CSS.Parrafos} key={Indice}>

                                <strong> { PropiedadFormateada } : </strong>
                                    
                                <em> { Valor } </em>
                                
                            </p> 
                            
                        )

                    })}

                </div>

                <div className={CSS.ContenedorDerecha}>

                    <img className={CSS.Imagen} src={Ruta} alt={Nombre} />

                    <Documentos />

                </div>

                
            </div>

        </div>

    )

}

export default ResumenSolicitud