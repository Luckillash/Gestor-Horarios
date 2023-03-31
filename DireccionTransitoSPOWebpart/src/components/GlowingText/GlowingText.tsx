import * as React from "react";
import CSS from "./GlowingText.module.scss"

interface IProps {

    Titulo?: string | undefined

    Estado?: boolean | undefined

    Centrar?: boolean | undefined

    Negrita?: boolean | undefined

    Cursiva?: boolean | undefined

    OnClick?: Function | undefined

    Tamaño?: string | undefined

    SetState?: React.Dispatch<React.SetStateAction<boolean>> | undefined

}

function GlowingText ({ Titulo, Estado, Centrar, Negrita, Cursiva, OnClick, Tamaño, SetState}: IProps): React.ReactElement {

    function onClick (e: React.MouseEvent<HTMLParagraphElement>): void {

        if (OnClick) OnClick()

        if (SetState) {

            SetState(!Estado)

        }
            
    }

    return(

        <>

            <p 

            className={CSS.GlowingText} 

            style={{ 

                alignSelf: this.Centrar ? "center" : "unset", 

                fontWeight: this.Negrita ? "bold" : "normal", 
                
                fontStyle: this.Cursiva ? "italic" : "normal", 
                
                margin: "0px",

                fontSize: this.Tamaño ? this.Tamaño : "1rem"
            
            }} 
            
            onClick={onClick}>

                {this.Titulo}

            </p>

        </>

    )

}

export default GlowingText
