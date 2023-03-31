import { DefaultButton, Dialog, DialogFooter, DialogType, Panel, PanelType, PrimaryButton, Spinner } from "office-ui-fabric-react"
import * as React from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import CSS from "../../webparts/licencia/components/Licencia.module.scss"
import { HorariosOcupados_Selector, Horarios_Selector, ObtenerHorariosOcupadosPorEtapa } from "../../redux/slices/DataInicialSlice";
import { Solicitud_Selector, SubirExamenPorEtapa, ObtenerExamenTeoricoPorId, ObtenerExamenPsicotecnicoPorId, ObtenerExamenPracticoPorId } from "../../redux/slices/LicenciaSlice";

interface IProps {

    MostrarPanel: boolean,

    Fecha: Date,

    Cabecera: string,

    SetMostrarPanel: React.Dispatch<React.SetStateAction<boolean>>

}

function PanelExamenTeorico ({ MostrarPanel, Fecha, Cabecera, SetMostrarPanel }: IProps): React.ReactElement {

	const Dispatch = useAppDispatch();

    const { Id, EtapaActual } = useAppSelector(Solicitud_Selector)

	const horarios = useAppSelector(Horarios_Selector);

	const horariosOcupados = useAppSelector(HorariosOcupados_Selector);

    const [ Cargando, setCargando ] = React.useState<boolean>(true)

    const [ HorarioExamen, setHorarioExamen ] = React.useState<string>()

    const [ HorarioExamenId, setHorarioExamenId ] = React.useState<number>()

    let Lista: string = ""

    const { Etapa } = EtapaActual

    switch (Etapa) {

        case "Examen teórico":

            Lista = "Licencia_Etapa_ExamenTeorico"

        break


        case "Examen psicotécnico":

            Lista = "Licencia_Etapa_ExamenPsicotecnico"
    
        break

        case "Examen práctico":

            Lista = "Licencia_Etapa_ExamenPractico"
        
        break

        case "Retiro licencia":

            Lista = "Licencia_Etapa_RetiroLicencia"
        
        break

        default:

        break
        
    }


    React.useEffect(() => {

        ( async () => {

            const Filtros = {

                Fecha: Fecha,

                Lista: Lista,

            }

            await Dispatch(ObtenerHorariosOcupadosPorEtapa(Filtros))

            setCargando(false)

        }) ()

    }, [])

    async function SubirFechaExamen (): Promise<void> {

        const formato: ISubirHorario = {

            Lista: Lista,

            IdSolicitudId: Id,

            FechaExamen: Fecha,

            HoraExamenId: HorarioExamenId

        }

        await Dispatch(SubirExamenPorEtapa(formato))

        switch (Etapa) {

            case "Examen teórico":
    
                await Dispatch(ObtenerExamenTeoricoPorId(Id))
    
            break
    
    
            case "Examen psicotécnico":
    
                await Dispatch(ObtenerExamenPsicotecnicoPorId(Id))
        
            break
    
            case "Examen práctico":
    
                await Dispatch(ObtenerExamenPracticoPorId(Id))
            
            break
    
            case "Retiro licencia":
    
                // Lista = "Licencia_RetiroLicencia"
            
            break
    
            default:
    
            break
            
        }

        setHorarioExamen(undefined)

        setHorarioExamenId(undefined)

        SetMostrarPanel(false)

    }

    function SeleccionarBloque (Horario: string, HorarioId: number): void {

        setHorarioExamen(Horario)

        setHorarioExamenId(HorarioId)

    }

    if (Cargando) return <Spinner />

    const dialogContentProps = {

        type: DialogType.normal,
    
        title: 'Horario seleccionado',
    
        closeButtonAriaLabel: 'Cerrar',
    
        subText: '¿Estás seguro de que deseas el horario de las ' + HorarioExamen + '?',
    
    };

    return (

        <>

            <Panel 
            type={PanelType.medium} 
            headerText={Cabecera} 
            isOpen={MostrarPanel} 
            onDismiss={() => SetMostrarPanel(false)} 
            closeButtonAriaLabel="Close"
            // onRenderFooterContent={Footer}
            isFooterAtBottom={true}>

                { horarios.map((horario, index, array) => {

                    const { Horario, Id } = horario

                    const horarioOcupado = horariosOcupados.some(({HoraExamenId}) => HoraExamenId === Id)

                    const horarioOcupadoData = horariosOcupados.find(({HoraExamenId}) => HoraExamenId === Id)

                    const ultimoIndice = horarios.length - 1 === index

                    const colorBloque = horarioOcupado ? CSS.HorarioExamenTeoricoOcupado : CSS.HorarioExamenTeoricoDisponible

                    return (

                        <>
                        
                            <div className={colorBloque} onClick={() => SeleccionarBloque(Horario, Id)} style={{ border: `${ ultimoIndice ? "none" : "" }`}} >
                                
                                <p style={{ width: "50px", textAlign: "center" }}>{Horario}</p>

                                { horarioOcupado ? <p style={{ width: "100px", textAlign: "center" }}>{horarioOcupadoData.Nombre}</p> : <p style={{ width: "100px", textAlign: "center" }}>Disponible</p> }
                            
                            </div>

                        </>

                    )

                })}

                <Dialog hidden={!HorarioExamen} onDismiss={() => setHorarioExamen(undefined)} dialogContentProps={dialogContentProps}>

                    <DialogFooter>

                        <PrimaryButton onClick={() => SubirFechaExamen()} text="Confirmar" />

                        <DefaultButton onClick={() => setHorarioExamen(undefined)} text="Rechazar" />

                    </DialogFooter>

                </Dialog>

            </Panel>

        </>

    )

}

export default PanelExamenTeorico