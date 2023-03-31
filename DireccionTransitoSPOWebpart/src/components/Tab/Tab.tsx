import { FontIcon, getTheme } from "office-ui-fabric-react";
import * as React from "react";
import CSS from "./Tab.module.scss"

interface IProps {

    OnClick?: () => void

    Mostrar: boolean

    ComponenteJSX: React.ReactElement

    TextoPrimario: string

    TextoSecundario: string

}

function Tab ({ OnClick, Mostrar, ComponenteJSX, TextoPrimario, TextoSecundario }: IProps ): React.ReactElement {

    function onClick () {

        OnClick()
        
    }

    return (

        <div aria-expanded={Mostrar} className={CSS.Tab} >

            <div className={CSS.Palanca} onClick={onClick}>
            
                <FontIcon iconName={`${ Mostrar ? "ChevronDown" : "ChevronRight" }`}/>

                <p className={CSS.Texto} >{ Mostrar ? TextoSecundario : TextoPrimario }</p>

            </div>

            { Mostrar && ComponenteJSX }

        </div>

    )

}

export default Tab

