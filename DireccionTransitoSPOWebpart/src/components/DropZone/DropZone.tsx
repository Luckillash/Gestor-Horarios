import { DetailsList, FontIcon, IColumn, Icon, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"
import CSS from "./DropZone.module.scss"
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';

interface IProps {

    SetState: React.Dispatch<React.SetStateAction<File[]>>

    Documentos: File[]

}

const columns: IColumn[] = [
    {
        key: 'column1',
        name: 'File Type',
        iconName: 'Page',
        isIconOnly: true,
        fieldName: 'type',
        minWidth: 16,
        maxWidth: 16,
        //   onColumnClick: this._onColumnClick,
        onRender: ({ name }) => {

            const array: string[] = name.split(".")

            const extension: string = array[array.length - 1]

            return <Icon {...getFileTypeIconProps({ extension: extension, size: 16 })} style={{ verticalAlign: 'middle', maxHeight: '16px', maxWidth: '16px' }} />
        
        },

    },
    {
        key: 'DocumentoExtra',
        fieldName: 'name', 
        name: 'Documento extra',
        minWidth: 100,
        maxWidth: 100,
    },
]

function DropZone ({ SetState, Documentos }: IProps): React.ReactElement {

    const [ DragActivo, setDragActivo ] = React.useState(false)

    // const [ Encima, setEncima ] = React.useState(false)

    const SelectorRef = React.useRef(null)

    // handle drag events
    function handleDrag (e: React.DragEvent<HTMLFormElement | HTMLDivElement>): void {

        e.preventDefault();

        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {

            setDragActivo(true)

        } else if (e.type === "dragleave") {

            setDragActivo(false)
        
        }
        
    }
  
    // triggers when file is dropped
    function handleDrop (e: React.DragEvent<HTMLFormElement | HTMLDivElement>): void {

        e.preventDefault();
        
        e.stopPropagation();
        
        setDragActivo(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {

            SetState(Array.from(e.dataTransfer.files))
        
        }
    
    }
  
    // triggers when file is selected with click
    function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {

        e.preventDefault();

        if (e.target.files && e.target.files[0]) {

            SetState(Array.from(e.target.files))

        }
        
    }
  
    // triggers the input when the button is clicked
    function onButtonClick (e: React.MouseEvent<HTMLButtonElement>): void {

        SelectorRef.current.click();

    }

    return (

        <form 
        
        className={` ${CSS.DragZone} ${ DragActivo ? CSS.DragZoneActiva : "" } ${ Documentos.length > 0 ? CSS.ContenedorFlex : ""} `} 
        
        onDragEnter={handleDrag} 
        
        onSubmit={(e) => e.preventDefault()} 
        
        // onMouseEnter={() => setEncima(true)} 
        
        // onMouseLeave={() => setEncima(false)}
        
        >

            <input className={CSS.Input} ref={SelectorRef} type="file" multiple={true} onChange={handleChange} />

            <div className={` ${CSS.Texto} ${ Documentos.length > 0 && CSS.TextoFlex } `}>
                    
                <p>Arrastra y suelta tu archivo aquí o</p>
                    
                <button className={CSS.Boton} onClick={onButtonClick}>Clickea aquí para subir archivo</button>

                <FontIcon iconName="Upload" style={{ fontSize: "40px", marginTop: "10px" }} />

            </div> 

            { Documentos.length > 0 && <hr style={{ height: "97.5%", border: "none", borderLeft: "1px dashed #cbd5e1" }} /> }

            { 

                Documentos.length > 0 &&
            
                    <div className={ Documentos.length > 0 && CSS.TextoFlex } style={{ height: "100%", overflow: "scroll" }}>

                        <DetailsList columns={columns} items={Documentos} selectionMode={SelectionMode.none} />

                    </div>
            
            }


            { DragActivo && <div className={ CSS.DragZoneArchivo } onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} /> }
        
        </form>

    )

}

export default DropZone