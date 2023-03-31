import * as React from "react"
import CSS from "./Loading.module.scss"

interface IProps {

    Ajustar: "Completa" | "Ajustar" | "Contenido"

}
function Loading ({ Ajustar }: IProps) {

    return (

        <div className={Ajustar}>

            <div className={CSS.spinner}>

                <div></div>

                <div className={CSS.rect2}></div>

                <div className={CSS.rect3}></div>

                <div className={CSS.rect4}></div>

                <div className={CSS.rect5}></div>

                Cargando

            </div>

        </div>

    )

}

export default Loading