import { Button } from "@fluentui/react-components";
import { ChevronDoubleLeft16Regular, ChevronDoubleLeft20Regular } from "@fluentui/react-icons";
import { MessageBar, MessageBarType, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ActualizarEtapa, Solicitud_Selector } from "../../redux/slices/LicenciaSlice";
import CSS from "./BotonCambioEtapa.module.scss"

interface IProps {

    EtapaDefinida: string,

    Etapas: IEtapa[],

    IdSolicitud: number,

    Aprobado: boolean
}

function BotonCambioEtapa ({ EtapaDefinida, Etapas, IdSolicitud, Aprobado }: IProps): React.ReactElement {

	const dispatch = useAppDispatch();

    const { EtapaActual } =  useAppSelector(Solicitud_Selector)

    const { Etapa } = EtapaActual

    const EtapaMinuscula = Etapa.toLowerCase()

    async function AvanzarEtapa (): Promise<void> {

        const Formato = {

            EtapaActual: EtapaActual,

            Etapas: Etapas,

            IdSolicitud: IdSolicitud

        }

        await dispatch(ActualizarEtapa(Formato))

    }

    const EsEtapaAvanzada: boolean = Etapa !== EtapaDefinida

    return (

        <>

            { EsEtapaAvanzada && 

                <MessageBar
                
                messageBarType={MessageBarType.success}

                isMultiline={false}

                >

                    ¡Examen ya aprobado!

                </MessageBar>
            
            }

            { !EsEtapaAvanzada && 

            <div className={CSS.Contenedor}>

                <Button 

                appearance="primary"

                className={CSS.Boton}

                onClick={AvanzarEtapa}

                disabled={!Aprobado}
                    
                icon={<ChevronDoubleLeft20Regular /> } > 

                    { Aprobado ? "Avanzar a la siguiente etapa" : "Falta aprobar el examen " + EtapaMinuscula }

                </Button>
                
            </div>

            }
            
        
        </>

        
    )

}

export default BotonCambioEtapa