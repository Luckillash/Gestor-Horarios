import { ProgressIndicator } from "office-ui-fabric-react";
import * as React from "react"

interface IProps {

    Estados: string[]
}

function IndicadorProgreso ({ Estados }: IProps ) {

	let total = 0

	for (let i = 0; i < Estados.length; i++) {

		const Estado = Estados[i];

		if (Estado === "Inactivo") total += 0

		if (Estado === "Cargando") total += 1

		if (Estado === "Finalizado") total += 2

	}
	
    const Porcentaje = total * 100 / Estados.length * 2

	return <ProgressIndicator label="Cargando información..." description="¡Que sea un día muy provechoso!" percentComplete={Porcentaje} />
		
}

export default IndicadorProgreso