import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { initializeIcons, Spinner } from 'office-ui-fabric-react';
import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";
import Calendario from './Calendario';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { useEffect } from 'react';

function Rutas (Props: IComponentProps): React.ReactElement {

	function fixWorkbench(): void {

		const Workbench = document.getElementById("workbenchPageContent")

		if (Workbench !== null) Workbench.style.maxWidth = "none"

    }
	
	useEffect(() => {

		initializeFileTypeIcons();

		initializeIcons();
	
		fixWorkbench();

    }, [])

	function ManejarFecha (Fecha: Date) {


	}

	return (

		<HashRouter>

			<Routes>

				<Route path="/" element={<Calendario ManejarFecha={ManejarFecha} />} />

			</Routes>

		</HashRouter>
			
	);

}

export default Rutas;