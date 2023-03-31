import { ProgressIndicator, Spinner } from "office-ui-fabric-react";
import * as React from "react"
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { Solicitud_Selector, ObtenerDocumentacionPorId, ObtenerExamenPracticoPorId, ObtenerExamenPsicotecnicoPorId, ObtenerExamenTeoricoPorId, ObtenerSolicitudPorId, EtapasSolicitud_Selector } from "../../../../redux/slices/LicenciaSlice";
import Resumen from "./Resumen";
import EtapaExamenTeorico from "./ExamenTeorico";
import EtapaExamenPsicotecnico from "./ExamenPsicotecnico";
import EtapaExamenPractico from "./ExamenPractico";
import EtapaPagoLicencia from "./Pago";
import EtapaRetiroLicencia from "./Retiro";
import IndicadorProgreso from "../../../../components/IndicadorProgreso/IndicadorProgreso";
import { useEffect, useState } from "react";
import MenuEtapas from "../../../../components/MenuEtapas/MenuEtapas";
import Etapas from "../../../../components/Etapas/Etapas";
import Loading from "../../../../components/Loading/Loading";

function Solicitud (): React.ReactElement {

	const Dispatch = useAppDispatch();

    const { IdSolicitud } = useParams()

    const { EtapaActual }: ISolicitudSeleccionada = useAppSelector(Solicitud_Selector)

    const EtapasSolicitud: IEtapa[] = useAppSelector(EtapasSolicitud_Selector)

    const [ Etapa, SetEtapa ] = useState<IEtapa>()

    const [ Cargando, SetCargando ] = useState<boolean>(true)

    async function ObtenerSolicitud () {

        const Id = parseInt(IdSolicitud);

        await Dispatch(ObtenerExamenTeoricoPorId(Id))

        await Dispatch(ObtenerExamenPsicotecnicoPorId(Id))

        await Dispatch(ObtenerExamenPracticoPorId(Id))

        const { payload }: any = await Dispatch(ObtenerSolicitudPorId(Id)) 

        const { Solicitud }: { Solicitud: ISolicitud } = payload

        const { Rut } = Solicitud

        const Documentacion = {

            Rut: Rut,

            Solicitud: Id

        }

        await Dispatch(ObtenerDocumentacionPorId(Documentacion))

        SetCargando(false)
        
    }

    useEffect(() => {

        ObtenerSolicitud()

    }, [])

    useEffect(() => {

        if (EtapaActual) {

            SetEtapa(EtapaActual)

        } 

    }, [EtapaActual])

    if (Cargando) return (

        <div>

            <Loading Ajustar={"Ajustar"} />

        </div>

    )

    const { Id } = Etapa
    
    return (

        <div>

            <Resumen />

            <MenuEtapas Ancho="70%" Etapas={EtapasSolicitud} Etapa={Id} EtapaLimite={Id} SetEtapa={SetEtapa} />

            { Id === 1 && <EtapaExamenTeorico /> }

            { Id === 2 && <EtapaExamenPsicotecnico /> }

            { Id === 3 && <EtapaExamenPractico /> }

            { Id === 4 && <EtapaPagoLicencia /> }

            { Id === 5 && <EtapaRetiroLicencia /> }

        </div>

    )

}

export default Solicitud