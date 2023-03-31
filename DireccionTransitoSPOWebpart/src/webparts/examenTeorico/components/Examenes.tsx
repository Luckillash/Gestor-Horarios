import { Button, CompoundButton } from "@fluentui/react-components"
import { Add24Regular, Checkmark24Regular } from "@fluentui/react-icons"
import { DetailsList, IColumn, Panel, PanelType } from "office-ui-fabric-react"
import * as React from "react"
import { useEffect, useState } from "react"
import Loading from "../../../components/Loading/Loading"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { HorariosOcupados_Selector, Horarios_Selector, ObtenerHorarios, ObtenerHorariosOcupadosPorEtapa } from "../../../redux/slices/DataInicialSlice"
import Cabecera from "../../licencia/components/Solicitudes/Cabecera"
import CSS from "./ExamenTeorico.module.scss"

function Examenes () {

    const Dispatch = useAppDispatch()

    const Horarios = useAppSelector(Horarios_Selector)

    const HorariosOcupados = useAppSelector(HorariosOcupados_Selector)

    const [ Cargando, SetCargando ] = useState<boolean>(true)
    
    const [ MostrarPanel, SetMostrarPanel ] = useState<boolean>(false)

    const [ HorariosPanel, SetHorariosPanel ] = useState<[]>([])

    async function Inicio () {

        const Fecha =  new Date()

        Fecha.setHours(0)

        Fecha.setMinutes(0)

        Fecha.setSeconds(0)

        Fecha.setMilliseconds(0)

        const Formato = {

            Fecha: Fecha,

            Lista: "Licencia_Etapa_ExamenTeorico"

        }

        await Dispatch(ObtenerHorarios())

        await Dispatch(ObtenerHorariosOcupadosPorEtapa(Formato))

        SetCargando(false)

    }

    async function PanelGestion (Horarios: any) {

        SetHorariosPanel(Horarios)

        SetMostrarPanel(!MostrarPanel)
        
    }

    useEffect(() => {

        Inicio()

    }, [])

    if (Cargando) return (

        <div>

            <Loading Ajustar={"Ajustar"} />

        </div>

    )

    const Columnas: IColumn[] = [

        {

            key: 'Nombre',

            fieldName: 'Nombre', 

            name: 'Nombre',

            minWidth: 16,

            maxWidth: 100,

        },

        {

            key: 'Id',

            fieldName: ' ', 

            name: 'Id',

            minWidth: 16,

            maxWidth: 80,

            onRender: ({ Licencia }) => {

                return (

                    <div className={CSS.ContenedorBoton}>

                        <Button className={CSS.BotonPrimario} appearance="primary" icon={<Checkmark24Regular />}> Aprobar </Button>

                    </div>
                
                )

            }

        }
    ]

    return (

        <div>

            {/* <div> Cabecera </div> */}

            <div className={CSS.Grid}>

                { Horarios.map((Objeto, Indice, Array) => {

                    const { Horario, Id } = Objeto

                    const Ocupados = HorariosOcupados.filter(({ HoraExamen }) => HoraExamen === Horario)

                    let Limite = false

                    if (Ocupados.length === 4) Limite = true

                    return (

                        <div key={Id} className={CSS.ContenedorBoton}>

                            <CompoundButton className={CSS.BotonPrimario} secondaryContent={"Examenes agendados: " + Ocupados.length} icon={ <Add24Regular/> } appearance="primary" onClick={() => PanelGestion(Ocupados)}>
                                
                                { Horario }
                                
                            </CompoundButton>

                        </div>

                    )

                })}

            </div>

            <Panel 

            type={PanelType.medium} 

            // headerText={Cabecera} 

            isOpen={MostrarPanel} 

            onDismiss={() => SetMostrarPanel(false)} 

            closeButtonAriaLabel="Close"

            // onRenderFooterContent={Footer}

            isFooterAtBottom={true}>

                <DetailsList items={HorariosPanel} columns={Columnas}/>

            </Panel>

        </div>

    )

}

export default Examenes