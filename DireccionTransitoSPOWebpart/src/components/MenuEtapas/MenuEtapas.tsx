import * as React from "react";
import CSS from "./MenuEtapas.module.scss"
import { getTheme } from "office-ui-fabric-react";
import { Fragment } from "react";

interface IProps {

	Etapas: IEtapa[],

	Etapa: number,

	EtapaLimite: number,

    SetEtapa: React.Dispatch<React.SetStateAction<IEtapa>>,

	Ancho?: string,

}

const temaSPO = getTheme()

function MenuEtapas ({ Etapas, Etapa, EtapaLimite, SetEtapa, Ancho }: IProps): React.ReactElement {

	function OnClick (etapa: IEtapa): void {

		const { Id } = etapa

		if ( Id !== Etapa && Id <= EtapaLimite ) SetEtapa(etapa)

	}

	const Limite = EtapaLimite - 1

	const Actual = Etapa - 1

	return (

		<section className={CSS.Contenedor}>

			<div className={CSS.Burbujas} style={{ width: Ancho, justifyContent: Ancho && "space-between" }}>

				{ Etapas.map((Etapa, Indice, Arreglo) => {

					const UltimoIndice = Arreglo.length - 1

					const EtapaSeleccionada = Indice === Actual

                    const EtapaAnterior: boolean = Actual > Indice

					const DeshabilitarBurbuja = Indice > Limite

					const DeshabilitarSeparador = Indice >= Limite

					return (

						<Fragment key={Indice}>

							<div>

								<button className={CSS.Burbuja} aria-disabled={DeshabilitarBurbuja} onClick={() => OnClick(Etapa)} >

									{ EtapaAnterior ? "✔" : Indice + 1 }

								</button>

								<p className={CSS.Texto} aria-selected={EtapaSeleccionada}>

									{ Etapa.Etapa }

								</p>
								
							</div>
								
							{ UltimoIndice !== Indice && <hr className={CSS.Linea} aria-disabled={DeshabilitarSeparador} />}
							
						</Fragment>
						
					)

				})}

			</div>

		</section>
		
	)

}

export default MenuEtapas