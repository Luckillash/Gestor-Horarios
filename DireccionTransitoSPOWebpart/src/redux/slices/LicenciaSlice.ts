import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { getSP } from '../../pnp/pnpConfig'
import * as moment from 'moment'
import { DropdownMenuItemType } from 'office-ui-fabric-react'
import { IFileAddResult } from '@pnp/sp/files'

const initialState = {

    //#region Solicitud

    Solicitud: {

        Id: undefined,

        NombreCompleto: undefined,
    
        Rut: undefined,
    
        Edad: undefined,
    
        NumeroContacto: undefined,
    
        Email: undefined,
    
        FechaInicio: undefined,
    
        TipoSolicitud: undefined,
    
        EtapaActual: undefined,
    
        EtapasLicencia: undefined,
    
        Licencia: undefined,
    
        UsaLentes: undefined,

    } as ISolicitudSeleccionada,

    Resumen: { } as IResumen,

    Documentos: [] as IDocumentos[],

    FotoPerfil: {

        Nombre: undefined,
    
        Ruta: undefined,

        Formato: undefined,

        IdSolicitud: undefined,

        TipoDocumento: undefined

    } as IDocumentos,

    EtapasSolicitud: [] as any[],

    ExamenTeorico: [] as IExamenTeorico[],

    ExamenPsicotecnico: [] as IExamenPsicotecnico[],

    ExamenPractico: [] as IExamenPractico[],

    //#endregion

}

export const Solicitud_Selector = (state: RootState) => state.Licencias.Solicitud

export const ExamenTeorico = (state: RootState) => state.Licencias.ExamenTeorico

export const ExamenPsicotecnico = (state: RootState) => state.Licencias.ExamenPsicotecnico

export const ExamenPractico = (state: RootState) => state.Licencias.ExamenPractico

export const Resumen_Selector = (state: RootState) => state.Licencias.Resumen

export const EtapasSolicitud_Selector = (state: RootState) => state.Licencias.EtapasSolicitud

export const Documentos = (state: RootState) => state.Licencias.Documentos

export const FotoPerfil = (state: RootState) => state.Licencias.FotoPerfil

async function SubirDocumentos (documentos: File[], rutaRelativa: string, metadata?: any) {

    const sp = getSP()

    for await (const documento of documentos) {

        const nombreDocumento = encodeURI(documento.name);

        let documentoSubido: IFileAddResult;
        
        if (documento.size <= 10485760) {

            documentoSubido = await sp.web.getFolderByServerRelativePath(rutaRelativa).files.addUsingPath(nombreDocumento, documento, { Overwrite: true });
        
            if (metadata) {

                let documento = await documentoSubido.file.getItem()
    
                documento.update(metadata)
    
            }

        } 
        
        else {

            documentoSubido = await sp.web.getFolderByServerRelativePath(rutaRelativa).files.addChunked(nombreDocumento, documento, (data) => {

                console.log(data);

            }, true);

            if (metadata) {

                const documento = await documentoSubido.file.getItem()
    
                documento.update(metadata)
    
            }
        
        }

    }

}

async function SubirDocumento (documento: File, rutaRelativa: string, metadata?: any) {

    const sp = getSP()

    const nombreDocumento = encodeURI(documento.name);

    let documentoSubido: IFileAddResult;
        
    if (documento.size <= 10485760) {

        documentoSubido = await sp.web.getFolderByServerRelativePath(rutaRelativa).files.addUsingPath(nombreDocumento, documento, { Overwrite: true });
        
        if (metadata) {

            let documento = await documentoSubido.file.getItem()

            documento.update(metadata)

        }

    } 
        
    else {

        documentoSubido = await sp.web.getFolderByServerRelativePath(rutaRelativa).files.addChunked(nombreDocumento, documento, (data: any) => {

            console.log(data);

        }, true);

        if (metadata) {

            let documento = await documentoSubido.file.getItem()

            documento.update(metadata)

        }
        
    }

    

}

export const ObtenerSolicitudPorId = createAsyncThunk(

    'Licencia/ObtenerSolicitudPorId',

    async function ObtenerSolicitudPorId (IdSolicitud: number): Promise<{ Solicitud: ISolicitudSeleccionada, Resumen: IResumen }> {

        const SP = getSP()

        let Solicitud: ISolicitudSeleccionada

        let Resumen: IResumen

        try {

            const { Id, NombreCompleto, Rut, Edad, FechaInicio, TipoSolicitud, EtapaActual, EtapasSolicitud, NumeroContacto, Email, Licencia, UsaLentes }: ISolicitudSeleccionadaSPO = await SP.web.lists
    
            .getByTitle("Licencia_Hechos_Solicitudes")
    
            .items
    
            .getById(IdSolicitud)
    
            .select("Id,NombreCompleto,Rut,Edad,FechaInicio,TipoSolicitud/Title,EtapaActual/Etapa,EtapaActual/Id,EtapasSolicitud/Etapa,EtapasSolicitud/Id,NumeroContacto,Email,Licencia/Licencia,UsaLentes")
    
            .expand("TipoSolicitud,EtapaActual,EtapasSolicitud,Licencia")
    
            ()

            const FormatoLicencia: ILicencia = {

                Licencia: Licencia.Licencia,

                Id: Licencia.Id

            }

            const FormatoEtapa: IEtapa = {

                Etapa: EtapaActual.Etapa,

                Id: EtapaActual.Id

            }

            Licencia.Licencia
            
            const Etapas: IEtapa[] = []
    
            for ( let i = 0 ; EtapasSolicitud.length > i ; i++ ) {
    
                const { Etapa, Id } = EtapasSolicitud[i];
    
                const Formato: IEtapa = {
    
                    Etapa,
    
                    Id
    
                }
    
                Etapas.push(Formato)
                
            }
    
            Solicitud = {
    
                Id: Id,
    
                NombreCompleto: NombreCompleto,
    
                Rut: Rut,
    
                Edad: Edad,
    
                NumeroContacto: NumeroContacto,
    
                Email: Email,
    
                FechaInicio: moment(new Date(FechaInicio)).format("DD/MM/YYYY"),
    
                TipoSolicitud: TipoSolicitud.Title,
    
                EtapaActual: FormatoEtapa,
    
                EtapasLicencia: Etapas,
    
                Licencia: FormatoLicencia,
    
                UsaLentes: UsaLentes
    
            }
    
    
            Resumen = {
    
                Id: Id,
    
                NombreCompleto: NombreCompleto,
    
                Rut: Rut,
    
                Edad: Edad,
    
                NumeroContacto: NumeroContacto,
    
                Email: Email,
    
                FechaInicio: moment(new Date(FechaInicio)).format("DD/MM/YYYY"),
    
                TipoSolicitud: TipoSolicitud.Title,
    
                Licencia: "Clase" + " " + Licencia.Licencia,
    
                UsaLentes: UsaLentes ? "Sí" : "No"
    
            }
            
        } catch (error) {

            console.log(error)
            
        }

        return {

            Solicitud: Solicitud,

            Resumen: Resumen,

        }

    }

)

export const ObtenerDocumentacionPorId = createAsyncThunk(

    'Licencia/ObtenerDocumentacionPorId',

    async function ObtenerDocumentacionPorId (Data: { Rut: string, Solicitud: number }): Promise<{ Documentos: IDocumentos[], FotoPerfil: IDocumentos }> {
    
        const { Rut, Solicitud } = Data

        const Lista: string = `/sites/TransitoTome/Licencia_Documentos/${Rut}`

        const Carpeta: string = `Licencia_Documentos/${Rut}`

        let Documentos: IDocumentos[] = []
    
        let FotoPerfil: IDocumentos = {

            Nombre: undefined,
        
            Ruta: undefined,
    
            Formato: undefined,
    
            IdSolicitud: undefined,
    
            TipoDocumento: undefined
    
        }

        const SP = getSP()

        try {
            
            const { Row } = await SP.web.getList(Lista).renderListDataAsStream(
    
                { ViewXml: 
    
                    `<View>
    
                        <Query>
    
                            <Where>
    
                                <Eq>
    
                                    <FieldRef Name='Solicitud'/>
    
                                    <Value Type='Lookup'>${Solicitud}</Value>
    
                                </Eq>
    
                            </Where>
    
                        </Query>
    
                        <ViewFields>
    
                            <FieldRef Name='BaseName' />
    
                            <FieldRef Name='FileRef' />
    
                            <FieldRef Name='File_x0020_Type' />
    
                            <FieldRef Name='Solicitud' />
    
                            <FieldRef Name='TipoDocumento' />
    
                        </ViewFields>
    
                        <QueryOptions />
    
                    </View>` 
    
                } ,
    
                { RootFolder: Carpeta }
    
            )
        
            const TenantUrl = window.location.protocol + "//" + window.location.host;
    
            for ( let i = 0 ; Row.length > i ; i++ ) {
    
                const { FileLeafRef, FileRef, File_x0020_Type, Solicitud, TipoDocumento } = Row[i];
    
                const [solicitud] = Solicitud
    
                const [tipoDocumento] = TipoDocumento
    
                const { lookupValue } = tipoDocumento
    
                const formato: IDocumentos = {
    
                    Nombre: FileLeafRef,
    
                    Ruta: TenantUrl + FileRef,
    
                    Formato: File_x0020_Type,
    
                    IdSolicitud: solicitud,
    
                    TipoDocumento: lookupValue
    
                }
    
                if (lookupValue === "Documento extra") Documentos.push(formato)
                
                if (lookupValue === "Foto de perfil") FotoPerfil = formato
                
            }

        } catch (error) {

            console.log(error)
            
        }

        return {

            Documentos: Documentos,

            FotoPerfil: FotoPerfil

        }

    }

)

export const ObtenerExamenTeoricoPorId = createAsyncThunk(

    'Licencia/ObtenerExamenTeoricoPorId',

    async function ObtenerExamenTeoricoPorId (IdSolicitud: number): Promise<IExamenTeorico[]> {

        const SP = getSP()

        const ExamenesTeoricos: IExamenTeorico[] = []

        try {
            
            const ExamenesTeoricosSPO: IExamenTeoricoSPO[] = await SP.web.lists
    
            .getByTitle("Licencia_Etapa_ExamenTeorico")
    
            .items
    
            .select("Id,FechaExamen,HoraExamen/Id,HoraExamen/Title,Correctas,Incorrectas,Estado")
    
            .expand("HoraExamen")
    
            .filter(`Solicitud/Id eq ${IdSolicitud}`)
    
            ()

            for ( let i = 0 ; i < ExamenesTeoricosSPO.length ; i++ ) {
    
                const { Id, FechaExamen, HoraExamen, Correctas, Incorrectas, PuntajePorcentual, Estado} = ExamenesTeoricosSPO[i];
    
                const Formato: IExamenTeorico = {
    
                    Intento: i + 1,
    
                    Id: Id,
    
                    FechaExamen: moment(new Date(FechaExamen)).format("DD/MM/YYYY"),
    
                    HoraExamen: HoraExamen.Title,
    
                    HoraExamenId: HoraExamen.Id,
    
                    Correctas: Correctas,
    
                    Incorrectas: Incorrectas,
    
                    PuntajePorcentual: PuntajePorcentual,

                    Estado: Estado,
    
                }
    
                ExamenesTeoricos.push(Formato)
    
            }

        } catch (error) {

            console.log(error)
            
        }

        console.log()

        return ExamenesTeoricos

    }

)

export const ObtenerExamenPsicotecnicoPorId = createAsyncThunk(

    'Licencia/ObtenerExamenPsicotecnicoPorId',

    async function ObtenerExamenPsicotecnicoPorId (IdSolicitud: number): Promise<IExamenPsicotecnico[]> {

        const SP = getSP()

        const ExamenesPsicotecnicos: IExamenPsicotecnico[] = []

        try {
            
            const ExamenesPsicotecnicosSPO: IObtenerExamenPsicotecnico[] = await SP.web.lists
    
            .getByTitle("Licencia_Etapa_ExamenPsicotecnico")
    
            .items
    
            .select("Id,FechaExamen,HoraExamen/Id,HoraExamen/Title,Estado")
    
            .expand("HoraExamen")
    
            .filter(`Solicitud/Id eq ${IdSolicitud}`)
    
            ()
    
    
            for ( let i = 0 ; i < ExamenesPsicotecnicosSPO.length ; i++ ) {
    
                const { Id, FechaExamen, HoraExamen, Estado } = ExamenesPsicotecnicosSPO[i];
    
                const Formato: IExamenPsicotecnico = {
    
                    Intento: i + 1,
    
                    Id: Id,
    
                    FechaExamen: moment(new Date(FechaExamen)).format("DD/MM/YYYY"),
    
                    HoraExamen: HoraExamen.Title,
    
                    HoraExamenId: HoraExamen.Id,
    
                    Estado: Estado,
    
                }
    
                ExamenesPsicotecnicos.push(Formato)
    
            }
    
        } catch (error) {

            console.log(error)
            
        }

        return ExamenesPsicotecnicos

    }

)

export const ObtenerExamenPracticoPorId = createAsyncThunk(

    'Licencia/ObtenerExamenPracticoPorId',

    async function ObtenerExamenPracticoPorId (IdSolicitud: number): Promise<IExamenPractico[]> {

        const SP = getSP()

        const ExamenesPracticos: IExamenPractico[] = []

        try {
            
            const ExamenesPracticosSPO: IObtenerExamenPractico[] = await SP.web.lists
    
            .getByTitle("Licencia_Etapa_ExamenPractico")
    
            .items
    
            .select("Id,FechaExamen,HoraExamen/Id,HoraExamen/Title,Estado")
    
            .expand("HoraExamen")
    
            .filter(`Solicitud/Id eq ${IdSolicitud}`)
    
            ()
    
    
            for ( let i = 0 ; i < ExamenesPracticosSPO.length ; i++ ) {
    
                const { Id, FechaExamen, HoraExamen, Estado } = ExamenesPracticosSPO[i];
    
                const Formato: IExamenPractico = {
    
                    Intento: i + 1,
    
                    Id: Id,
    
                    FechaExamen: moment(new Date(FechaExamen)).format("DD/MM/YYYY"),
    
                    HoraExamen: HoraExamen.Title,
    
                    HoraExamenId: HoraExamen.Id,
    
                    Estado: Estado,
    
                }
    
                ExamenesPracticos.push(Formato)
    
            }
    
        } catch (error) {

            console.log(error)
            
        }

        return ExamenesPracticos
        
    }

)

export const SubirSolicitud = createAsyncThunk(

    'Licencia/SubirSolicitud',

    async function SubirSolicitud (Solicitud: ISolicitudEnviar): Promise<number> {

        const SP = getSP()

        let IdSolicitud: number

        try {

            const { data } = await SP.web.lists
    
            .getByTitle("Licencia_Hechos_Solicitudes")
    
            .items
    
            .add(Solicitud)
    
            const { Id } = data

            IdSolicitud = Id
            
        } catch (error) {
            
            console.log(error)

        }

        return IdSolicitud

    }

)

export const SubirDocumentacion = createAsyncThunk(

    'Licencia/SubirDocumentacion',

    async function SubirDocumentacion (documentacion: ISolicitudDocumentacion): Promise<void> {

        const SP = getSP()

        const { Foto, DocumentosExtra, Rut, Id } = documentacion

        const MetadataFoto = {

            SolicitudId: Id,

            TipoDocumentoId: 3

        }

        const MetadataDocumentacionExtra = {

            SolicitudId: Id,

            TipoDocumentoId: 1

        }

        const RutaRelativa: string = `/sites/TransitoTome/Licencia_Documentos/${Rut}`

        try {
            
            const { Exists } = await SP.web.getFolderByServerRelativePath(RutaRelativa).select('Exists')();
    
            if (!Exists) {
    
                await SP.web.folders.addUsingPath(RutaRelativa);
    
                if(DocumentosExtra.length > 0) await SubirDocumentos(DocumentosExtra, RutaRelativa, MetadataDocumentacionExtra)
    
                await SubirDocumento(Foto, RutaRelativa, MetadataFoto)
    
            } 
    
            else {
    
                if(DocumentosExtra.length > 0) await SubirDocumentos(DocumentosExtra, RutaRelativa, MetadataDocumentacionExtra)
    
                await SubirDocumento(Foto, RutaRelativa, MetadataFoto)
    
            }

        } catch (error) {

            console.log(error)

        }

        return

    }

)

export const SubirExamenPorEtapa = createAsyncThunk(

    'Licencia/SubirExamenPorEtapa',

    async function SubirExamenPorEtapa (horario: ISubirHorario): Promise<void> {

        const { IdSolicitudId, FechaExamen, HoraExamenId, Lista } = horario

        const SP = getSP()

        const Formato = {
            
            SolicitudId: IdSolicitudId,

            FechaExamen: FechaExamen,

            HoraExamenId: HoraExamenId

        }

        try {
            
            //Subo el exámen
            await SP.web.lists
    
            .getByTitle(Lista)
    
            .items
    
            .add(Formato)

            //Obtengo ids de los exámenes
            const Examenes = await SP.web.lists

            .getByTitle(Lista)

            .items

            .select("Id")

            .filter(`Solicitud/Id eq ${IdSolicitudId}`)

            ()

            const IdExamenes: number[] = Examenes.map(({ Id }) => Id)

            let FormatoActualizacion

            switch (Lista) {

                case "Licencia_Etapa_ExamenTeorico":

                FormatoActualizacion = {

                    ExamenTeoricoId: IdExamenes

                }

                break

                case "Licencia_Etapa_ExamenPsicotecnico":

                FormatoActualizacion = {

                    ExamenPsicotecnicoId: IdExamenes

                }

                break

                case "Licencia_Etapa_ExamenPractico":

                FormatoActualizacion = {

                    ExamenPracticoId: IdExamenes

                }

                break

            }

            //Actualizo la solicitud
            await SP.web.lists

            .getByTitle("Licencia_Hechos_Solicitudes")

            .items

            .getById(IdSolicitudId)

            .update(FormatoActualizacion)
    
        } catch (error) {

            console.log(error)
            
        }

    }

)

export const ActualizarEtapa = createAsyncThunk(

    'Licencia/ActualizarEtapa',

    async function ActualizarEtapa ({ EtapaActual, Etapas, IdSolicitud }: { EtapaActual: IEtapa, Etapas: IEtapa[], IdSolicitud: number}): Promise<IEtapa> {

        const { Etapa } = EtapaActual

        const ArregloEtapas = Etapas.map( ({ Etapa }) => Etapa )

        const IndexSiguiente = ArregloEtapas.indexOf(Etapa) + 1

        const EtapaId = Etapas[IndexSiguiente].Id

        const Formato = {

            EtapaActualId: EtapaId

        }

        try {
            
            const SP = getSP()
            
            await SP.web.lists
    
            .getByTitle("Licencia_Hechos_Solicitudes")
    
            .items
    
            .getById(IdSolicitud)
    
            .update(Formato)
    
            const { EtapaActual } = await SP.web.lists
    
            .getByTitle("Licencia_Hechos_Solicitudes")
    
            .items
    
            .getById(IdSolicitud)
    
            .select("EtapaActual/Id,EtapaActual/Etapa")
    
            .expand("EtapaActual")
    
            ()
    
            return EtapaActual

        } catch (error) {

            console.log(error)
            
        }

    }

)

export const LicenciaSlice = createSlice({

    name: 'Licencia',
    
    initialState, 

    reducers: { 

    },

    extraReducers: (builder) => {

        builder

        //#region Solicitud por Id

        .addCase(ObtenerSolicitudPorId.pending, (state) => {

        })

        .addCase(ObtenerSolicitudPorId.fulfilled, (state, action) => {

            const { Solicitud, Resumen } = action.payload

            const { EtapasLicencia } = Solicitud

            state.Solicitud = Solicitud;

            state.Resumen = Resumen;

            state.EtapasSolicitud = EtapasLicencia;

        }) 

        .addCase(ObtenerSolicitudPorId.rejected, (state) => {

        })

        //#endregion

        //#region Documentación por Id

        .addCase(ObtenerDocumentacionPorId.pending, (state) => {

        })

        .addCase(ObtenerDocumentacionPorId.fulfilled, (state, action) => {

            const { Documentos, FotoPerfil } = action.payload

            state.Documentos = Documentos;

            state.FotoPerfil = FotoPerfil;

        }) 

        .addCase(ObtenerDocumentacionPorId.rejected, (state) => {

        })  

        //#endregion

        //#region Examen teórico

        .addCase(ObtenerExamenTeoricoPorId.pending, (state) => {

        })

        .addCase(ObtenerExamenTeoricoPorId.fulfilled, (state, action) => {

            const Examenes = action.payload

            state.ExamenTeorico = Examenes;

        }) 

        .addCase(ObtenerExamenTeoricoPorId.rejected, (state) => {

        })  

        //#endregion

        //#region Examen psicotécnico

        .addCase(ObtenerExamenPsicotecnicoPorId.pending, (state) => {

        })

        .addCase(ObtenerExamenPsicotecnicoPorId.fulfilled, (state, action) => {

            const Examenes = action.payload

            state.ExamenPsicotecnico = Examenes;

        }) 

        .addCase(ObtenerExamenPsicotecnicoPorId.rejected, (state) => {

        })  

        //#endregion

        //#region Examen práctico

        .addCase(ObtenerExamenPracticoPorId.pending, (state) => {

        })

        .addCase(ObtenerExamenPracticoPorId.fulfilled, (state, action) => {

            const Examenes = action.payload

            state.ExamenPractico = Examenes;

        }) 

        .addCase(ObtenerExamenPracticoPorId.rejected, (state) => {

        })  

        //#endregion

        //#region Actualizar etapa

        .addCase(ActualizarEtapa.pending, (state) => {

        })

        .addCase(ActualizarEtapa.fulfilled, (state, action) => {

            const EtapaActual = action.payload

            state.Solicitud.EtapaActual = EtapaActual

        }) 

        .addCase(ActualizarEtapa.rejected, (state) => {

        })  
        //#endregion
    },

})

export const { } = LicenciaSlice.actions

export default LicenciaSlice.reducer

 