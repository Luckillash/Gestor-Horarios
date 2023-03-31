import { Input } from "@fluentui/react-components"
import { Label } from "office-ui-fabric-react"
import * as React from "react"
import CSS from "./InputPrimario.module.scss"

interface IProps {

    Titulo: string,

    Tipo: "number" | "time" | "text" | "tel" | "url" | "email" | "search" | "password" | "date" | "datetime-local" | "month" | "week",

    Icono: React.ReactElement,

    SetState?: React.Dispatch<React.SetStateAction<string>> 

    State: string
    
}

function InputPrimario ({ Titulo, Tipo, Icono, SetState, State }: IProps): React.ReactElement {

    return (

        <div className={CSS.Filtro}>

            <Label>{ Titulo }</Label>
            
            <Input value={State} contentBefore={Icono} type={Tipo} onChange={(ev, data) => SetState(data.value)} />
    
        </div>

    )

}

export default InputPrimario
