import { getTheme } from "office-ui-fabric-react";
import * as React from "react";
import { IFechas } from "../interfaces/Fechas";

interface IProps {

    AñoSeleccionado: number,

    MesSeleccionado: number,

    FechaSeleccionada: Date,

    SetFechaSeleccionada: React.Dispatch<React.SetStateAction<Date>>

}

function Fechas ({ AñoSeleccionado, MesSeleccionado, FechaSeleccionada, SetFechaSeleccionada }: IProps): React.ReactElement {

    const Tema = getTheme()

    const PrimerDiaMesSeleccionado = new Date(AñoSeleccionado, MesSeleccionado, 1).getDay(); // Día de la semana. // 0 = 6 

    const FechasPresentables: IFechas[] = []

    function CompararFechas (Fecha: number, Antecede: boolean, Precede: boolean): boolean {

        let Seleccionado: boolean

        if (Antecede) {

            if (MesSeleccionado === 0) Seleccionado = FechaSeleccionada.getTime() === new Date (AñoSeleccionado - 1, 11, Fecha).getTime()

            else Seleccionado = FechaSeleccionada.getTime() === new Date (AñoSeleccionado, MesSeleccionado - 1, Fecha).getTime()

            return Seleccionado

        } 

        if (Precede) {

            if (MesSeleccionado === 11) Seleccionado = FechaSeleccionada.getTime() === new Date (AñoSeleccionado + 1, 0, Fecha).getTime()

            else Seleccionado = FechaSeleccionada.getTime() === new Date (AñoSeleccionado, MesSeleccionado + 1, Fecha).getTime()

            return Seleccionado

        }

        Seleccionado = !Antecede && !Precede && FechaSeleccionada.getTime() === new Date (AñoSeleccionado, MesSeleccionado, Fecha).getTime()

        return Seleccionado

    }

    function SeleccionarFecha (Fecha: number, Antecede: boolean, Precede: boolean): void {

        if (Antecede) {

            if (MesSeleccionado === 0) SetFechaSeleccionada(new Date(AñoSeleccionado - 1, 11, Fecha))

            else SetFechaSeleccionada(new Date(AñoSeleccionado, MesSeleccionado - 1, Fecha))

            return

        } 

        if (Precede) {

            if (MesSeleccionado === 11) SetFechaSeleccionada(new Date(AñoSeleccionado + 1, 0, Fecha))
            
            else SetFechaSeleccionada(new Date(AñoSeleccionado, MesSeleccionado + 1, Fecha))

            return

        }


        SetFechaSeleccionada(new Date(AñoSeleccionado, MesSeleccionado, Fecha))

    }

    function AgregarDiasAntecesores (DiasAntecesores: number): void {

        let UltimaFechaMesAnterior = new Date(AñoSeleccionado, MesSeleccionado, 0).getDate(); // Obtengo la última fecha del mes anterior.

        while (DiasAntecesores !== 0) {

            const Formato: IFechas = {

                Antecede: true,

                Precede: false,

                Fecha: UltimaFechaMesAnterior

            }

            FechasPresentables.push(Formato)
            
            UltimaFechaMesAnterior = UltimaFechaMesAnterior - 1

            DiasAntecesores--

        }

        FechasPresentables.sort( (a,b) => { return a.Fecha - b.Fecha } )

    }

    function AgregarDias (): void {

        const UltimaFechaMesSeleccionado = new Date(AñoSeleccionado, MesSeleccionado + 1, 0).getDate();

        for (let i = 1; i <= UltimaFechaMesSeleccionado; i++) {

            const Formato: IFechas = {

                Antecede: false,

                Precede: false,

                Fecha: i

            }

            FechasPresentables.push(Formato)

        }

    }

    function AgregarDiasPredecesores (): void {

        if (FechasPresentables.length !== 42) {

            let nuevoDia = 1 

            for ( let j = FechasPresentables.length ; j < 42 ; j++ ) {

                const Formato: IFechas = {

                    Antecede: false,
    
                    Precede: true,
    
                    Fecha: nuevoDia
    
                }

                FechasPresentables.push(Formato)

                nuevoDia++
                
            }

        }

    }

    if (PrimerDiaMesSeleccionado === 1) { // Si el primer día es 1 (Lunes)

        AgregarDias()

        AgregarDiasPredecesores() // Si las fechas presentables no son 42, se le agregan dias del próximo mes.

    }

    if (PrimerDiaMesSeleccionado !== 1) { // Si el primer día no es 1

        switch (PrimerDiaMesSeleccionado) { // Primero agrego los dias antecesores.

            case 0: // Domingo

                AgregarDiasAntecesores(6)

                break

            case 2: // Martes

                AgregarDiasAntecesores(1)

                break


            case 3: // Miércoles
            
                AgregarDiasAntecesores(2)

                break

            case 4: // Jueves

                AgregarDiasAntecesores(3)

                break

            case 5: // Viernes

                AgregarDiasAntecesores(4)


                break

            case 6: // Sábado

                AgregarDiasAntecesores(5)

                break

        }

        AgregarDias() // Luego agregro los dias del mes actual.

        AgregarDiasPredecesores() // Si las fechas presentables no son 42, se le agregan dias del próximo mes.

    }

    return (

        <>

            { FechasPresentables.map((FechaPresentable, Index, Array) => {

                const { Fecha, Antecede, Precede } = FechaPresentable

                const Seleccionado = CompararFechas(Fecha, Antecede, Precede)

                return (

                    <div

                    style={{ color: (Antecede || Precede) && "#BCBBD9", backgroundColor: Seleccionado && Tema.palette.themePrimary }}
                    
                    onClick={() => SeleccionarFecha(Fecha, Antecede, Precede)}>

                        { Fecha }

                    </div>
                    
                )

            })}
        
        </>

    )
    
}

export default Fechas