import { DetailsList, FontIcon, getTheme, IColumn, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"
import AgendarFecha from "../../../../components/AgendarFecha/AgendarFecha"
import BotonCambioEtapa from "../../../../components/BotonCambioEtapa/BotonCambioEtapa"
import { useAppSelector } from "../../../../redux/hooks"
import { Solicitud_Selector, ExamenTeorico, EtapasSolicitud_Selector } from "../../../../redux/slices/LicenciaSlice"

function EtapaExamenTeorico (): React.ReactElement {

    const theme = getTheme()

    const { Id, EtapaActual }: ISolicitudSeleccionada = useAppSelector(Solicitud_Selector)

    const ExamenesTeoricos: IExamenTeorico[] = useAppSelector(ExamenTeorico)

    const EtapasSolicitud: IEtapa[] = useAppSelector(EtapasSolicitud_Selector)

    const Columnas: IColumn[] = [

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

            key: 'Estado',

            fieldName: 'Estado', 

            name: '¿Aprobado?',

            minWidth: 16,

            maxWidth: 80,

            onRender: ({ Estado }) => {

                return (

                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                        { Estado === "Aprobado" && <FontIcon aria-label="Completed" iconName="Completed" style={{ color: "green", fontSize: 20, verticalAlign: "center" }} /> }

                        { Estado === "En proceso" && <FontIcon aria-label="Error" iconName="Error" style={{ color: "#CCCC00", fontSize: 20, verticalAlign: "center" }} /> }

                        { Estado === "Rechazado" && <FontIcon aria-label="ErrorBadge" iconName="ErrorBadge" style={{ color: "red", fontSize: 20, verticalAlign: "center" }} /> }
                    
                    </div>

                )

            }

        },

        {

            key: 'PuntajePorcentual',

            fieldName: 'PuntajePorcentual', 

            name: 'Puntaje porcentual',

            minWidth: 16,

            maxWidth: 16,

        },

        {

            key: 'PuntajePorcentual',

            fieldName: 'PuntajePorcentual', 

            name: 'Puntaje porcentual',

            minWidth: 16,

            maxWidth: 16,

        },

    ]

    const Aprobado = ExamenesTeoricos.some(({ Estado }) => Estado === "Aprobado")

    const EnProceso =  ExamenesTeoricos.some(({ Estado }) => Estado === "En proceso")

    const { Etapa } = EtapaActual

    return (

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px"}}>

            <div style={{ width: "70%" }}>

                <BotonCambioEtapa EtapaDefinida={Etapa} Etapas={EtapasSolicitud} IdSolicitud={Id} Aprobado={ Aprobado } />
                    
                { ExamenesTeoricos.length > 0 && <DetailsList items={ExamenesTeoricos} columns={Columnas} selectionMode={SelectionMode.none} /> }

                { (!EnProceso && !Aprobado) && <AgendarFecha EtapaActual={Etapa} /> }

            </div>

        </div>

    )

}

export default EtapaExamenTeorico