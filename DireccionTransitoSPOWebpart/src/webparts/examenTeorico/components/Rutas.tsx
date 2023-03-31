import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { initializeIcons } from 'office-ui-fabric-react';
import * as React from 'react';
import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Calendario from '../../calendario/components/Calendario';
import Examenes from './Examenes';

function Rutas () {

	function fixWorkbench(): void {

		const Workbench = document.getElementById("workbenchPageContent")

		if (Workbench !== null) Workbench.style.maxWidth = "none"

    }
	
	useEffect(() => {

		initializeFileTypeIcons();

		initializeIcons();
	
		fixWorkbench();

    }, [])
	
	return (		
	
		<HashRouter>

			<Routes>

				<Route path="/" element={<Examenes />} />

			</Routes>

		</HashRouter>

	)

}

export default Rutas

