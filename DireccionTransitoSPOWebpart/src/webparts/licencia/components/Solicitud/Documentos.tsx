import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";
import { Dismiss24Filled, Dismiss24Regular, DocumentSearch24Regular } from "@fluentui/react-icons";
import { DetailsList, IColumn, Icon, SelectionMode } from "office-ui-fabric-react";
import * as React from "react";
import { useAppSelector } from "../../../../redux/hooks";
import { Documentos } from "../../../../redux/slices/LicenciaSlice";
import CSS from "../Licencia.module.scss"

function DocumentosSolicitud (): React.ReactElement {

    const documentos = useAppSelector(Documentos)

    const [ Abierto, SetAbierto ] = React.useState<boolean>(false);

    const columns: IColumn[] = [

        {

            key: 'Formato',

            name: 'Formato',

            iconName: 'Page',

            isIconOnly: true,

            fieldName: 'Formato',

            minWidth: 16,

            maxWidth: 16,

            onRender: ({ Formato }) => {
    
                const array: string[] = Formato.split(".")
    
                const extension: string = array[array.length - 1]
    
                return <Icon {...getFileTypeIconProps({ extension: extension, size: 16 })} style={{ verticalAlign: 'middle', maxHeight: '16px', maxWidth: '16px' }} />
            
            },
    
        },

        {

            key: 'Nombre',

            fieldName: 'Nombre', 

            name: 'Nombre',

            minWidth: 16,

            maxWidth: 200,

        },

        {

            key: 'TipoDocumento',

            fieldName: 'TipoDocumento', 
            
            name: 'Tipo de documento',

            isSorted: true,

            minWidth: 16,

            maxWidth: 200,

        },

    ]

    return (

        <Dialog open={Abierto} onOpenChange={(event, data) => SetAbierto(data.open)}>

            <DialogTrigger>

                <Button appearance="primary" className={ CSS.Boton } icon={ <DocumentSearch24Regular/> }>Documentos</Button>

            </DialogTrigger>

            <DialogSurface>

                <DialogBody>

                    <DialogTitle>Documentos</DialogTitle>

                    <DialogContent>

                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam exercitationem cumque repellendus eaque
                        est dolor eius expedita nulla ullam? Tenetur reprehenderit aut voluptatum impedit voluptates in natus iure
                        cumque eaque?

                        <DetailsList items={documentos} columns={columns} selectionMode={SelectionMode.none} />

                    </DialogContent>

                    <DialogActions>
                        
                        <DialogTrigger>

                            <Button appearance="secondary" icon={ <Dismiss24Regular/> }>Cerrar</Button>

                        </DialogTrigger>

                    </DialogActions>

                </DialogBody>

            </DialogSurface>

        </Dialog>
    )

}

export default DocumentosSolicitud