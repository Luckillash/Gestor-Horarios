import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { initializeIcons, Spinner } from 'office-ui-fabric-react';
import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";
import Calendarios from './Calendarios';
import { IComponentProps } from '../interfaces/IComponentProps';

function Rutas (props: IComponentProps): React.ReactElement {

    const [cargando, setCargando] = React.useState(true)

	React.useEffect(() => {

		initializeFileTypeIcons();

		initializeIcons();
	
		fixWorkbench();

        setCargando(false)

    }, [])

	function fixWorkbench(): void {

        document.getElementById("workbenchPageContent").style.maxWidth = "none";
        
    }

    if (cargando) return <Spinner />

	return (

		<HashRouter>

			<Routes>

				<Route path="/" element={<Calendarios />} />

			</Routes>

		</HashRouter>
			
	);

}

export default Rutas;