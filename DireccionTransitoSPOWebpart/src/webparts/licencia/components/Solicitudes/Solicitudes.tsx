import * as React from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useNavigate } from "react-router-dom";
import CSS from "../Licencia.module.scss"
import { DetailsList, FontIcon, IColumn, SelectionMode } from "office-ui-fabric-react";
import Tab from "../../../../components/Tab/Tab";
import Filtros from "./Filtros";
import Cabecera from "./Cabecera";
import { PaginarGrillaSolicitudes, SolicitudesFiltradas_Selector, Solicitudes_Selector } from "../../../../redux/slices/DataInicialSlice";
import { ReactElement, useEffect, useState } from "react";
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";

function Solicitudes (): ReactElement {

	const Dispatch = useAppDispatch();

    const Redireccionar = useNavigate()

	const SolicitudesFiltradas: ISolicitud[] = useAppSelector(SolicitudesFiltradas_Selector);

    const [ MostrarFiltros, SetMostrarFiltros ] = useState<boolean>(false)

    const [ Pagina, SetPagina ] = useState<number>(1)

    useEffect(() => {

        CambiarPagina(1)
        
    }, [])

    const Columnas: IColumn[] = [

        {

            key: 'Acceso',

            iconName: 'Edit',

            isIconOnly: true,

            fieldName: 'Acceso', 

            name: 'Acceso',

            minWidth: 16,

            maxWidth: 16,

            onRender: ({ Id }) => {

                return (
                    
                    <FontIcon onClick={() => {Redireccionar(`/${Id}`)}} aria-label="Edit" iconName="Edit" style={{ color: "#ff47a1", fontSize: 14, verticalAlign: "center", cursor: "pointer" }} />
                
                )

            }

        },

        {

            key: 'Id',

            fieldName: 'Id', 

            name: 'Id',

            minWidth: 16,

            maxWidth: 16,

        },

        {

            key: 'NombreCompleto',

            fieldName: 'NombreCompleto', 

            name: 'Nombre Completo',

            isSorted: true,

            minWidth: 16,

            maxWidth: 200,

        },

        {

            key: 'Rut',

            fieldName: 'Rut', 

            name: 'Rut',

            minWidth: 16,

            maxWidth: 100,

        },

        {

            key: 'NumeroContacto',

            fieldName: 'NumeroContacto', 

            name: 'Numero de contacto',

            minWidth: 16,

            maxWidth: 140,

        },

        {

            key: 'Licencia',

            fieldName: 'Licencia', 

            name: 'Licencia',

            minWidth: 16,

            maxWidth: 80,

            onRender: ({ Licencia }) => {

                return ("Clase " + Licencia.Licencia)

            }

        },

        {

            key: 'PrimeraLicencia',

            fieldName: 'PrimeraLicencia', 

            name: '¿Primera licencia?',

            minWidth: 16,

            maxWidth: 120,

            onRender: ({ TipoSolicitud }) => {

                return (

                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                        { TipoSolicitud === "Primera licencia" && <FontIcon aria-label="Completed" iconName="Completed" style={{ color: "green", fontSize: 20, verticalAlign: "center" }} /> }

                        { TipoSolicitud === "Renovar licencia" && <FontIcon aria-label="ErrorBadge" iconName="ErrorBadge" style={{ color: "red", fontSize: 20, verticalAlign: "center" }} /> }
                    
                    </div>

                )

            }

        },

        {

            key: 'FechaInicio',

            fieldName: 'FechaInicio', 

            name: 'Fecha de inicio',

            minWidth: 16,

            maxWidth: 100,

        },

        {

            key: 'EtapaActual',

            fieldName: 'EtapaActual', 

            name: 'Etapa',

            minWidth: 16,

            maxWidth: 100,

            onRender: ({ EtapaActual }) => {

                return EtapaActual.Etapa

            }

        },

        {

            key: 'UsaLentes',

            fieldName: 'UsaLentes',

            name: '¿Usa lentes?',

            minWidth: 16,

            maxWidth: 16,

            onRender: ({ UsaLentes }) => {

                return (

                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                        { UsaLentes ? <FontIcon aria-label="Completed" iconName="Completed" style={{ color: "green", fontSize: 20, verticalAlign: "center" }} /> : <FontIcon aria-label="ErrorBadge" iconName="ErrorBadge" style={{ color: "red", fontSize: 20, verticalAlign: "center" }} /> }

                    </div>

                )

            }

        }

    ]

    function CambiarPagina (Pagina: number) {

        Dispatch(PaginarGrillaSolicitudes(Pagina))

        SetPagina(Pagina)

    }

    function Paginas () {

        const Paginas: number = SolicitudesFiltradas.length / 8

        return Paginas

    }

    return (

        <div className={CSS.Contenido}>

            <Cabecera /> 

            <Tab OnClick={() => SetMostrarFiltros(!MostrarFiltros)} Mostrar={MostrarFiltros} TextoPrimario="Mostrar filtros" TextoSecundario="Ocultar filtros" ComponenteJSX={<Filtros />}/>

            <DetailsList items={SolicitudesFiltradas} columns={Columnas} selectionMode={SelectionMode.none} />

            <Pagination

            currentPage={Pagina}

            totalPages={Paginas()} 

            onChange={(Pagina) => CambiarPagina(Pagina)}

            limiter={2} // Optional - default value 3

            />

        </div>

    )

}

export default Solicitudes