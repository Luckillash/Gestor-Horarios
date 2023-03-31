import { DetailsList, FontIcon, getTheme, IColumn, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"
import AgendarFecha from "../../../../components/AgendarFecha/AgendarFecha"
import BotonCambioEtapa from "../../../../components/BotonCambioEtapa/BotonCambioEtapa"
import { useAppSelector } from "../../../../redux/hooks"
import { EtapasSolicitud_Selector, ExamenPsicotecnico, Solicitud_Selector } from "../../../../redux/slices/LicenciaSlice"

function EtapaExamenPsicotecnico (): React.ReactElement {

    const theme = getTheme()

    const ExamenesPsicotecnicos: IExamenPsicotecnico[] = useAppSelector(ExamenPsicotecnico)

    const { Id, EtapaActual }: ISolicitudSeleccionada = useAppSelector(Solicitud_Selector)

    const etapasSolicitud: IEtapa[] = useAppSelector(EtapasSolicitud_Selector)

    const columns: IColumn[] = [

        {

            key: 'Intento',

            fieldName: 'Intento', 

            name: 'Intento',

            minWidth: 16,

            maxWidth: 50,

            onRender: ({ Intento }) => {

                return <p style={{ color: theme.palette.themePrimary, margin: 0 }}>{Intento}</p>

            }

        },

        {

            key: 'FechaExamen',

            fieldName: 'FechaExamen', 

            name: 'Fecha del examen',

            minWidth: 16,

            maxWidth: 120,

        },

        {

            key: 'HoraExamen',

            fieldName: 'HoraExamen', 

            name: 'Hora del examen',

            minWidth: 16,

            maxWidth: 120,

        },

        {

            key: 'Aprobado',

            fieldName: 'Aprobado', 

            name: '¿Aprobado?',

            minWidth: 16,

            maxWidth: 80,

            onRender: ({ Aprobado, PuntajePorcentual }) => {

                return (

                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                        { Aprobado && <FontIcon aria-label="Completed" iconName="Completed" style={{ color: "green", fontSize: 20, verticalAlign: "center" }} /> }

                        { ( !Aprobado && !PuntajePorcentual ) && <FontIcon aria-label="Error" iconName="Error" style={{ color: "#CCCC00", fontSize: 20, verticalAlign: "center" }} /> }

                        { ( !Aprobado && PuntajePorcentual ) && <FontIcon aria-label="ErrorBadge" iconName="ErrorBadge" style={{ color: "red", fontSize: 20, verticalAlign: "center" }} /> }
                    
                    </div>

                )

            }

        },

    ]

    const Aprobado = ExamenesPsicotecnicos.some(({ Estado }) => Estado === "Aprobado")

    const EnProceso =  ExamenesPsicotecnicos.some(({ Estado }) => Estado === "En proceso")

    const { Etapa } = EtapaActual

    return (

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px"}}>

            <div style={{ width: "70%" }}>

                <BotonCambioEtapa EtapaDefinida={Etapa} Etapas={etapasSolicitud} IdSolicitud={Id} Aprobado={Aprobado} />
                    
                { ExamenesPsicotecnicos.length > 0 && <DetailsList items={ExamenesPsicotecnicos} columns={columns} selectionMode={SelectionMode.none} /> }

                { (!Aprobado && !EnProceso) && <AgendarFecha EtapaActual={Etapa} /> }

            </div>

        </div>

    )
    
}

export default EtapaExamenPsicotecnico