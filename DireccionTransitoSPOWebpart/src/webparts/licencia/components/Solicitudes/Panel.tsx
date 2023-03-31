import { Checkbox, DatePicker, DefaultButton, Dropdown, Panel, PanelType, PrimaryButton, TextField } from "office-ui-fabric-react"
import * as React from "react"
import { SubirDocumentacion, SubirSolicitud } from "../../../../redux/slices/LicenciaSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import DropZone from "../../../../components/DropZone/DropZone";
import DropPhoto from "../../../../components/DropPhoto/DropPhoto";
import CSS from "../Licencia.module.scss"
import Tab from "../../../../components/Tab/Tab";
import { useNavigate } from "react-router-dom";
import { LicenciasOpciones_Selector } from "../../../../redux/slices/DataInicialSlice";
import { useState } from "react";

interface IProps {

    TipoSolicitudId: number,

    Cabecera: string,

    MostrarPanel: boolean,

    SetMostrarPanel: React.Dispatch<React.SetStateAction<boolean>>

}

function PanelNuevaSolicitud ({ TipoSolicitudId, Cabecera, MostrarPanel, SetMostrarPanel }: IProps): React.ReactElement {

    const Redireccionar = useNavigate()

	const Dispatch = useAppDispatch();

	const LicenciasOpciones: ILicenciaOpcion[] = useAppSelector(LicenciasOpciones_Selector);

    const [ Nombres, SetNombres ] = useState<string>()

    const [ Apellidos, SetApellidos ] = useState<string>()

    const [ Rut, SetRut ] = useState<string>()

    const [ FechaNacimiento, SetFechaNacimiento ] = useState<Date>()

    const [ NumeroContacto, SetNumeroContacto] = useState<string>()

    const [ Email, SetEmail ] = useState<string>()

    const [ Licencia, SetLicencia] = useState<number>()

    const [ Direccion, SetDireccion ] =  useState<string>()

    const [ Foto, SetFoto] = useState<File>()

    const [ Documentos, SetDocumentos] = useState<File[]>([])

    const [ UsaLentes, SetUsaLentes ] = useState<boolean>(false)

    const [ MostrarDocumentacion, SetMostrarDocumentacion ] = useState(false)

    const Validador = !Nombres || !Apellidos || !Rut || !FechaNacimiento || !NumeroContacto || !Email || !Licencia || !Foto

    async function Subir (): Promise<void> {

        const FechaActual = new Date()

        const Solicitud: ISolicitudEnviar = {

            TipoSolicitudId: TipoSolicitudId,

            LicenciaId: Licencia,

            Nombres: Nombres,

            Apellidos: Apellidos,

            Rut: Rut,

            FechaNacimiento: FechaNacimiento,

            FechaInicio: FechaActual,

            EtapaActualId: TipoSolicitudId === 1 ? 1 : 2,

            EtapasSolicitudId: TipoSolicitudId === 1 ? [1,2,3,4,5] : [2,4,5],

            Email: Email,

            NumeroContacto: NumeroContacto,

            UsaLentes: UsaLentes

        }

        const { payload } = await Dispatch(SubirSolicitud(Solicitud)) as { payload: number }

        const Documentacion: ISolicitudDocumentacion = {

            Id: payload,

            Rut: Rut,

            Foto: Foto,

            DocumentosExtra: Documentos
            
        }

        await Dispatch(SubirDocumentacion(Documentacion))

        Redireccionar(`/${payload}`)

    }

    function Footer (): React.ReactElement {

        return (

            <div style={{ width: "250px", display: "flex", justifyContent: "space-between" }}>

                <PrimaryButton disabled={Validador} iconProps={{ iconName: "Accept"}} onClick={() => Subir()} text="Aceptar" />

                <DefaultButton iconProps={{ iconName: "Cancel"}} onClick={() => SetMostrarPanel(false)} text="Cancelar" />

            </div>

        )

    }

    return (

        <Panel 

        type={PanelType.medium} 

        headerText={Cabecera} 

        isOpen={MostrarPanel} 

        onDismiss={() => SetMostrarPanel(false)} 

        closeButtonAriaLabel="Close"

        onRenderFooterContent={Footer}

        isFooterAtBottom={true}>
        
            <div className={CSS.Panel}>

                <div className={CSS.ContenedorDatos} >

                    <TextField value={Nombres} required label="Nombres" onChange={(ev, nombres) => SetNombres(nombres)} />

                    <DatePicker value={FechaNacimiento} isRequired label="Fecha de nacimiento" onSelectDate={(fechaNacimiento) => SetFechaNacimiento(fechaNacimiento)} />
                    
                    <TextField value={Rut} required label="Rut" onChange={(ev, rut) => SetRut(rut)} />

                    <TextField value={NumeroContacto} required label="Numero de contacto" onChange={(ev, numeroContacto) => SetNumeroContacto(numeroContacto)} />

                    <TextField value={Email} required label="Email" onChange={(ev, email) => SetEmail(email)} />

                    <Dropdown required label="Licencia" options={LicenciasOpciones} dropdownWidth={200} onChange={(ev, option) => SetLicencia(option.key as number)} />

                </div>

                <div className={CSS.ContenedorDatos} >

                    <TextField required label="Apellidos" onChange={(ev, apellidos) => SetApellidos(apellidos)} />

                    <DropPhoto SetState={SetFoto} Foto={Foto} />

                </div>

            </div>

            <TextField value={Direccion} required label="Direccion" onChange={(ev, direccion) => SetDireccion(direccion)} />

            <div style={{ margin: "10px 0px" }}>

                <Checkbox label="¿Usa lentes?" onChange={(ev, boolean) => SetUsaLentes(boolean)} />

            </div>

            <Tab 

            OnClick={() => SetMostrarDocumentacion(true)}

            Mostrar={MostrarDocumentacion}
            
            TextoPrimario="Ocultar documentación extra" 
            
            TextoSecundario="Agregar documentación extra" 
            
            ComponenteJSX={<DropZone SetState={SetDocumentos} Documentos={Documentos} />}/>

        </Panel>

    )

}

export default PanelNuevaSolicitud