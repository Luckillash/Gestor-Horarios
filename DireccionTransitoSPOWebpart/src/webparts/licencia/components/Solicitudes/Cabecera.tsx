import * as React from 'react';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, CompoundButton } from '@fluentui/react-components';
import { Add24Regular, ArrowCounterclockwise24Regular } from "@fluentui/react-icons";
import CSS from "../Licencia.module.scss"
import PanelNuevaSolicitud from "./Panel";
import { ReactElement, useState } from 'react';

function Cabecera (): ReactElement {

    const [ NuevaLicencia, SetNuevaLicencia ] = useState(false)

    const [ RenovarLicencia, SetRenovarLicencia ] = useState(false)

    return (

        <div className={CSS.Cabecera}>

            <div className={CSS.ContenedorBotones}>

                <CompoundButton className={CSS.BotonPrimario} secondaryContent="Para nuevos conductores" icon={ <Add24Regular/> } appearance="primary" onClick={() => SetNuevaLicencia(true)}>
                        
                    Nueva licencia
                    
                </CompoundButton>

                <CompoundButton className={CSS.BotonSecundario} secondaryContent="Para conductores experimentados" icon={ <ArrowCounterclockwise24Regular/> } appearance="primary" onClick={() => SetRenovarLicencia(true)}>
                    
                    Renovar licencia
                
                </CompoundButton>

            </div>

            <img className={CSS.Imagen} src={require('../../assets/MinisterioTransporte.png')} alt="" />

            <PanelNuevaSolicitud TipoSolicitudId={1} Cabecera={"Nueva licencia"} MostrarPanel={NuevaLicencia} SetMostrarPanel={SetNuevaLicencia} />

            <PanelNuevaSolicitud TipoSolicitudId={2} Cabecera={"Renovar licencia"} MostrarPanel={RenovarLicencia} SetMostrarPanel={SetRenovarLicencia} />
        
        </div>

    )

}

export default Cabecera