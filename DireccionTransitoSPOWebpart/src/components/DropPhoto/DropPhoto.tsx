import { FontIcon, MessageBar, MessageBarType } from "office-ui-fabric-react"
import * as React from "react"
import CSS from "./DropPhoto.module.scss"

interface IProps {

    SetState: React.Dispatch<React.SetStateAction<File>>

    Foto: File

}

const formatoImagenes: string[] = ["png","jpg","jpeg"]

function DropPhoto ({ SetState, Foto }: IProps): React.ReactElement {

    const [ DragActivo, setDragActivo ] = React.useState(false)

    const [ Encima, setEncima ] = React.useState(false)

    const [ ErrorFormato, setErrorFormato ] = React.useState(false)

    const SelectorRef = React.useRef(null)

    // handle drag events
    function handleDrag (e: React.DragEvent<HTMLFormElement | HTMLDivElement>): void {

        e.preventDefault();

        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {

            setDragActivo(true);

        } else if (e.type === "dragleave") {

            setDragActivo(false);

        }
        
    }
  
    // triggers when file is dropped
    function handleDrop (e: React.DragEvent<HTMLFormElement | HTMLDivElement>): void {

        e.preventDefault();
        
        e.stopPropagation();
        
        setDragActivo(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {

            const { type } = e.dataTransfer.files[0] as File

            const esImagen = formatoImagenes.some(formatoImagen => type.includes(formatoImagen))

            if (esImagen) { 

                setErrorFormato(false);
                
                SetState(e.dataTransfer.files[0])

            }

            else setErrorFormato(true);

        }

    }
  
    // triggers when file is selected with click
    function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {

        e.preventDefault();

        if (e.target.files && e.target.files[0]) {

            const { type } = e.target.files[0] as File

            const esImagen = formatoImagenes.some(formatoImagen => type.includes(formatoImagen))

            if (esImagen) {

                setErrorFormato(false);

                SetState(e.target.files[0])

            } 

            else setErrorFormato(true);

        }
        
    }
  
    // triggers the input when the button is clicked
    function onButtonClick (e: React.MouseEvent<HTMLButtonElement>): void {

        SelectorRef.current.click();

    }

    const FotoSubida: string = Foto ? URL.createObjectURL(Foto) : undefined

    return (

        <form className={` ${CSS.DragZone} ${ DragActivo ? CSS.DragZoneActiva : "" } `} onDragEnter={handleDrag} onDrop={handleDrop} onSubmit={(e) => e.preventDefault()} >
            
            <input className={CSS.Input} ref={SelectorRef} type="file" multiple={true} onChange={handleChange} />

            <div className={` ${CSS.Texto} ${ Foto && CSS.TextoFlex } `}>
                    
                <p>Arrastra y suelta tu foto aquí o</p>
                    
                <button className={CSS.Boton} onClick={onButtonClick}>Clickea aquí para subir una foto</button>

                <FontIcon iconName="EditPhoto" style={{ fontSize: "40px", marginTop: "10px" }} />

            </div> 

            { FotoSubida && <img src={FotoSubida} className={`${CSS.Imagen} ${ Encima ? CSS.ImagenBlur : "" }`} onMouseEnter={() => setEncima(true)} />}

            { Encima && 
            
                <div className={CSS.NuevaImagen} onMouseLeave={() => setEncima(false)}>

                    <p>Arrastra y suelta otra foto aquí o</p>

                    <button className={CSS.Boton} onClick={onButtonClick}>Clickea aquí para subir otra foto</button>

                    <FontIcon iconName="Add" style={{ fontSize: "40px", marginTop: "10px" }} />

                </div>  
            
            }

            { ErrorFormato && 
                
                <MessageBar className={CSS.Error} messageBarType={MessageBarType.error} isMultiline={false} onDismiss={() => () => setErrorFormato(false)} dismissButtonAriaLabel="Close">
                    
                    Solo formatos PNG / JPG / JPEG

                </MessageBar>

            }

            { DragActivo && <div className={ CSS.DragZoneArchivo } onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} /> }

        </form>
        
    )


}

export default DropPhoto