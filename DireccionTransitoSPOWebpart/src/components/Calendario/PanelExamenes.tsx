import { DetailsList, IColumn, Panel, PanelType, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"
import { useState } from "react"
import Tab from "../../../components/Tab/Tab"
import { useAppSelector } from "../../../redux/hooks"
import { PanelExamenTeorico_Selector, PanelExamenPsicotecnico_Selector, PanelExamenPractico_Selector } from "../CalendarioSliceReducer"

interface IProps {

    MostrarPanel: boolean

    SetMostrarPanel: React.Dispatch<React.SetStateAction<boolean>>
    
}

function PanelExamenes ({ MostrarPanel, SetMostrarPanel }: IProps) {

    const [ MostrarTeoricos, SetMostrarTeoricos ] = useState(false)

    const [ MostrarPsicotecnicos, SetMostrarPsicotecnicos ] = useState(false)

    const [ MostrarPracticos, SetMostrarPracticos ] = useState(false)

    const ExamenesTeoricos = useAppSelector(PanelExamenTeorico_Selector)

    const ExamenesPsicotecnicos = useAppSelector(PanelExamenPsicotecnico_Selector)

    const ExamenesPracticos = useAppSelector(PanelExamenPractico_Selector)

    const Columnas: IColumn[] = [

        {

            key: 'NombreCompleto',

            fieldName: 'NombreCompleto', 

            name: 'Nombre',

            minWidth: 16,

            maxWidth: 250,

        },

        {

            key: 'HoraExamen',

            fieldName: 'HoraExamen', 

            name: 'Hora del examen',

            minWidth: 16,

            maxWidth: 100,

        },

    ]

    const ListadoTeoricos = <DetailsList items={ExamenesTeoricos} columns={Columnas} selectionMode={SelectionMode.none} />

    const ListadoPsicotecnicos = <DetailsList items={ExamenesPsicotecnicos} columns={Columnas} selectionMode={SelectionMode.none} />

    const ListadoPracticos = <DetailsList items={ExamenesPracticos} columns={Columnas} selectionMode={SelectionMode.none} />

    return (

        <Panel type={PanelType.medium} headerText="Sample panel" isOpen={MostrarPanel} onDismiss={() => SetMostrarPanel(false)} closeButtonAriaLabel="Close">

            <Tab OnClick={() => SetMostrarTeoricos(true)} Mostrar={MostrarTeoricos} TextoPrimario="Mostrar exámenes teóricos" TextoSecundario="Esconder exámenes teóricos" ComponenteJSX={ListadoTeoricos} />

            <Tab OnClick={() => SetMostrarPsicotecnicos(true)} Mostrar={MostrarPsicotecnicos} TextoPrimario="Mostrar exámenes psicotécnicos" TextoSecundario="Esconder exámenes psicotécnicos" ComponenteJSX={ListadoPsicotecnicos} />

            <Tab OnClick={() => SetMostrarPracticos(true)} Mostrar={MostrarPracticos} TextoPrimario="Mostrar exámenes prácticos" TextoSecundario="Esconder exámenes prácticos" ComponenteJSX={ListadoPracticos} />

        </Panel>

    )

}

export default PanelExamenes