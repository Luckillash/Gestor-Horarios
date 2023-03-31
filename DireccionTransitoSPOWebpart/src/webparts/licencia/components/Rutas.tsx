import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Solicitudes from "./Solicitudes/Solicitudes"
import Solicitud from './Solicitud/Solicitud';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";
import { IComponentProps } from '../interfaces/IComponentProps';
import IndicadorProgreso from '../../../components/IndicadorProgreso/IndicadorProgreso';
import { ObtenerLicencias, ObtenerSolicitudes, ObtenerEtapas, ObtenerHorarios } from '../../../redux/slices/DataInicialSlice';
import { useEffect, useState } from 'react';
import Loading from '../../../components/Loading/Loading';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';

function Rutas (Props: IComponentProps): React.ReactElement {

	function fixWorkbench(): void {

		const Workbench = document.getElementById("workbenchPageContent")

		if (Workbench !== null) Workbench.style.maxWidth = "none"

    }

	fixWorkbench();

	const Dispatch = useAppDispatch();

    const [ Cargando, SetCargando ] = useState<boolean>(true)

	async function Inicio () {

		await Dispatch(ObtenerLicencias())

    	await Dispatch(ObtenerSolicitudes())

		await Dispatch(ObtenerEtapas())

		await Dispatch(ObtenerHorarios())

		initializeFileTypeIcons();

		SetCargando(false)

	}

	useEffect(() => {

		Inicio()

    }, [])

	if (Cargando) return (

        <div>

            <Loading Ajustar={"Ajustar"} />

        </div>

    )

	return (

		<HashRouter>

			<Routes>

				<Route path="/" element={<Solicitudes />} />

				<Route path="/:IdSolicitud" element={<Solicitud />} />
				
			</Routes>

		</HashRouter>
			
	);

}

export default Rutas;