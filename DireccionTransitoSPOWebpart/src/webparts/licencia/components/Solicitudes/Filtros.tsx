import * as React from "react"
import { Button, Input, Label } from "@fluentui/react-components"
import { NumberSymbolRegular, PersonRegular, Search24Regular, SearchRegular } from "@fluentui/react-icons"
import CSS from "../Licencia.module.scss"
import { useAppDispatch } from "../../../../redux/hooks"
import InputPrimario from "../../../../components/InputPrimario/InputPrimario"
import { FiltrarGrillaSolicitudes } from "../../../../redux/slices/DataInicialSlice"
import { useEffect } from "react"

function Filtros (): React.ReactElement {

	const Dispatch = useAppDispatch();

    const [ Id, SetId ] = React.useState<string>("")

    const [ Nombre, SetNombre ] = React.useState<string>("")

    const [ Rut, SetRut ] = React.useState<string>("")

    useEffect(() => {

        const Formato: IFiltroSolicitud = {

            Id,

            Nombre,

            Rut

        }

        Dispatch(FiltrarGrillaSolicitudes(Formato))

    }, [ Id, Nombre, Rut ])

    function BorrarFiltros (): void {

        SetId("")

        SetNombre("")

        SetRut("")

    }

    return (

        <div className={CSS.Filtros}>
            
            <InputPrimario Titulo="Id" Tipo="number" Icono={<NumberSymbolRegular />} SetState={SetId} State={Id} />

            <InputPrimario Titulo="Nombre" Tipo="text" Icono={<PersonRegular />} SetState={SetNombre} State={Nombre} />

            <InputPrimario Titulo="Rut" Tipo="text" Icono={<SearchRegular />} SetState={SetRut} State={Rut} />

            <Button appearance="primary" onClick={BorrarFiltros} className={CSS.Boton}>Borrar filtros</Button>

        </div>

    )

}

export default Filtros