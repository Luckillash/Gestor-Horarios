import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { initializeIcons, Spinner } from 'office-ui-fabric-react';
import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";
import Calendario from './Calendario';

function Rutas (props: IComponentProps): React.ReactElement {

	React.useEffect(() => {

		initializeFileTypeIcons();

		initializeIcons();
	
		fixWorkbench();

    }, [])

	function fixWorkbench(): void {

        document.getElementById("workbenchPageContent").style.maxWidth = "none";
        
    }

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