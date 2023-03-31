using DireccionTransitoDataAPI.Interfaces;
using PnP.Core;
using PnP.Core.Model.SharePoint;
using PnP.Core.QueryModel;
using MySql.Data.MySqlClient;
using DireccionTransitoDataAPI.Entities;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;
using PnP.Core.Model.Teams;
using Org.BouncyCastle.Crypto;
using System.Collections.Generic;
using Google.Protobuf.WellKnownTypes;
using System.Xml.Linq;
using AngleSharp.Dom;

namespace DireccionTransitoDataAPI.Services {
    public class DataService: IDataService
    {

        private readonly IConfiguration Configuration;

        private readonly IAuthenticationManager AuthenticationManager;

        public DataService (IAuthenticationManager authenticationManager, IMySQL mySQL, IConfiguration configuration)
        {

            AuthenticationManager = authenticationManager;

            Configuration = configuration;

        }

        public async Task<List<Dictionary<string, object>>> ObtenerEtapas(string SitioSharepointEncriptado)
        {

            string SPO = DesencriptarSitioSPO(SitioSharepointEncriptado);

            using (var Context = await AuthenticationManager.GetContext(new Uri(SPO)))
            {

                var ListaSPO = await Context.Web.Lists.GetByTitleAsync("Licencia_Maestra_Etapas",

                    p => p.Title,

                    p => p.Items,

                    p => p.Fields.QueryProperties(

                        p => p.InternalName,

                        p => p.FieldTypeKind,

                        p => p.TypeAsString,

                        p => p.Title

                    )

                 );

                string ViewXml =

                    @$"<View>

                        <ViewFields>

                            <FieldRef Name='Etapa' />

                            <FieldRef Name='PrimeraLicencia' />

                            <FieldRef Name='RenovarLicencia' />

                        </ViewFields>

                    </View>";

                await ListaSPO.LoadItemsByCamlQueryAsync(new CamlQueryOptions()
                {

                    ViewXml = ViewXml,

                    DatesInUtc = true,

                });

                IEnumerable<IListItem> Items = ListaSPO.Items.AsRequested();

                List<Dictionary<string, object>> InformacionIterada = Iterar(Items);

                return InformacionIterada;

            }

        }

        public async Task<List<Dictionary<string, object>>> ObtenerLicencias(string SitioSharepointEncriptado)
        {

            string SPO = DesencriptarSitioSPO(SitioSharepointEncriptado);

            using (var Context = await AuthenticationManager.GetContext(new Uri(SPO)))
            {

                var ListaSPO = await Context.Web.Lists.GetByTitleAsync("Licencia_Maestra_Licencias",

                    p => p.Title,

                    p => p.Fields.QueryProperties(

                        p => p.InternalName,

                        p => p.FieldTypeKind,

                        p => p.TypeAsString,

                        p => p.Title

                    )

                 );

                string ViewXml =

                    @$"<View>

                        <ViewFields>

                            <FieldRef Name='Licencia' />

                            <FieldRef Name='TipoLicencia' />

                            <FieldRef Name='Descripcion' />

                        </ViewFields>

                    </View>";

                await ListaSPO.LoadItemsByCamlQueryAsync(new CamlQueryOptions()
                {

                    ViewXml = ViewXml,

                    DatesInUtc = true

                });

                IEnumerable<IListItem> Items = ListaSPO.Items.AsRequested();

                List<Dictionary<string, object>> InformacionIterada = Iterar(Items);

                return InformacionIterada;

            }

        }

        public async Task<List<Dictionary<string, object>>> ObtenerHorarios(string SitioSharepointEncriptado)
        {

            string SPO = DesencriptarSitioSPO(SitioSharepointEncriptado);

            using (var Context = await AuthenticationManager.GetContext(new Uri(SPO)))
            {

                var ListaSPO = await Context.Web.Lists.GetByTitleAsync("Licencia_Maestra_Horarios",

                    p => p.Title,

                    p => p.Fields.QueryProperties(

                        p => p.InternalName,

                        p => p.FieldTypeKind,

                        p => p.TypeAsString,

                        p => p.Title

                    )

                 );

                string ViewXml =

                    @$"<View>

                        <ViewFields>

                            <FieldRef Name='Horario' />

                            <FieldRef Name='ExamenTeorico' />

                            <FieldRef Name='ExamenPsicotecnico' />

                            <FieldRef Name='ExamenPractico' />

                        </ViewFields>

                    </View>";

                await ListaSPO.LoadItemsByCamlQueryAsync(new CamlQueryOptions()
                {

                    ViewXml = ViewXml,

                    DatesInUtc = true

                });

                IEnumerable<IListItem> Items = ListaSPO.Items.AsRequested();

                List<Dictionary<string, object>> InformacionIterada = Iterar(Items);

                return InformacionIterada;

            }

        }

        public async Task<List<Dictionary<string, object>>> ObtenerHorariosOcupados(string SitioSharepointEncriptado, DateTime Fecha, string Lista)
        {

            string SPO = DesencriptarSitioSPO(SitioSharepointEncriptado);

            using (var Context = await AuthenticationManager.GetContext(new Uri(SPO)))
            {

                var ListaSPO = await Context.Web.Lists.GetByTitleAsync(Lista,

                    p => p.Title,

                    p => p.Fields.QueryProperties(

                        p => p.InternalName,

                        p => p.FieldTypeKind,

                        p => p.TypeAsString,

                        p => p.Title

                    )

                 );

                var FechaFormateada = Fecha.ToString("yyyy-MM-ddTHH:mm:ssZ");

                string ViewXml =

                    @$"<View>

                        <ViewFields>

                            <FieldRef Name='FechaExamen' />

                            <FieldRef Name='HoraExamen' />

                            <FieldRef Name='Solicitud' />

                        </ViewFields>

                        <Query>

                            <Where>

                                <Eq>
    
                                    <FieldRef Name='FechaExamen' />

                                    <Value Type='DateTime'>{FechaFormateada}</Value>
                                </Eq>

                            </Where>

                        </Query>

                    </View>";

                await ListaSPO.LoadListDataAsStreamAsync(new RenderListDataOptions()
                {

                    ViewXml = ViewXml,

                    RenderOptions = RenderListDataOptionsFlags.None,

                    DatesInUtc = false

                });

                IEnumerable<IListItem> Items = ListaSPO.Items.AsRequested();

                List<Dictionary<string, object>> InformacionIterada = Iterar(Items);

                return InformacionIterada;

            }

        }

        public async Task<List<Dictionary<string, object>>> ObtenerSolicitudes(string SitioSharepointEncriptado, int IdUsuario)
        {

            string SPO = DesencriptarSitioSPO(SitioSharepointEncriptado);

            using (var Context = await AuthenticationManager.GetContext(new Uri(SPO)))
            {

                var ListaSPO = await Context.Web.Lists.GetByTitleAsync("Licencia_Hechos_Solicitudes", 
                        
                    p => p.Title,
                                                        
                    p => p.Fields.QueryProperties(

                        p => p.InternalName,

                        p => p.FieldTypeKind,

                        p => p.TypeAsString,

                        p => p.Title
                            
                    )

                );

                string ViewXml = 
                        
                    @$"<View>

                        <ViewFields>

                            <FieldRef Name='Id' />

                            <FieldRef Name='IDUsuario' />

                            <FieldRef Name='NombreCompleto' />

                            <FieldRef Name='Rut' />

                            <FieldRef Name='Edad' />

                            <FieldRef Name='FechaInicio' />

                            <FieldRef Name='NumeroContacto' />

                            <FieldRef Name='Licencia' />

                            <FieldRef Name='TipoSolicitud' />

                            <FieldRef Name='EtapaActual' />

                            <FieldRef Name='ExamenTeorico' />

                            <FieldRef Name='ExamenPsicotecnico' />

                            <FieldRef Name='ExamenPractico' />

                        </ViewFields>

                        <Query>

                            <Where>

                                <Eq>

                                    <FieldRef Name='IDUsuario'/>

                                    <Value Type='Integer'>{IdUsuario}</Value>

                                </Eq>

                            </Where>

                        </Query>

                    </View>";

                await ListaSPO.LoadListDataAsStreamAsync(new RenderListDataOptions()
                {

                    ViewXml = ViewXml,

                    RenderOptions = RenderListDataOptionsFlags.None,

                    DatesInUtc = true

                });

                IEnumerable<IListItem> Items = ListaSPO.Items.AsRequested();

                List<Dictionary<string, object>> Solicitudes = Iterar(Items);

                foreach(var Solicitud in Solicitudes)
                {

                    int IdSolicitud = (int)Solicitud["Id"];

                    Solicitud["ExamenTeorico"] = await ObtenerExamenes(SitioSharepointEncriptado, IdSolicitud, "Examen teórico");

                    Solicitud["ExamenPsicotecnico"] = await ObtenerExamenes(SitioSharepointEncriptado, IdSolicitud, "Examen psicotécnico");

                    Solicitud["ExamenPractico"] = await ObtenerExamenes(SitioSharepointEncriptado, IdSolicitud, "Examen práctico");

                }

                return Solicitudes;

            }

        }

        public async Task<Dictionary<string, object>> ObtenerSolicitud(string SitioSharepointEncriptado, int IdSolicitud)
        {

            string SPO = DesencriptarSitioSPO(SitioSharepointEncriptado);

            using (var Context = await AuthenticationManager.GetContext(new Uri(SPO)))
            {

                var ListaSPO = await Context.Web.Lists.GetByTitleAsync("Licencia_Hechos_Solicitudes",

                    p => p.Title,

                    p => p.Fields.QueryProperties(

                        p => p.InternalName,

                        p => p.FieldTypeKind,

                        p => p.TypeAsString,

                        p => p.Title

                    )

                );

                string ViewXml =

                    @$"<View>

                        <ViewFields>

                            <FieldRef Name='Id' />

                            <FieldRef Name='IDUsuario' />

                            <FieldRef Name='NombreCompleto' />

                            <FieldRef Name='Rut' />

                            <FieldRef Name='Edad' />

                            <FieldRef Name='FechaInicio' />

                            <FieldRef Name='NumeroContacto' />

                            <FieldRef Name='Licencia' />

                            <FieldRef Name='TipoSolicitud' />

                            <FieldRef Name='EtapaActual' />

                            <FieldRef Name='ExamenTeorico' />

                            <FieldRef Name='ExamenPsicotecnico' />

                            <FieldRef Name='ExamenPractico' />

                        </ViewFields>

                        <Query>

                            <Where>

                                <Eq>

                                    <FieldRef Name='ID'/>

                                    <Value Type='Number'>{IdSolicitud}</Value>

                                </Eq>

                            </Where>

                        </Query>

                    </View>";

                await ListaSPO.LoadListDataAsStreamAsync(new RenderListDataOptions()
                {

                    ViewXml = ViewXml,

                    RenderOptions = RenderListDataOptionsFlags.None,

                    DatesInUtc = true

                });

                IListItem Item = ListaSPO.Items.AsRequested().FirstOrDefault();

                Dictionary<string, object> Solicitud = Limpiar(Item);

                Solicitud["ExamenTeorico"] = await ObtenerExamenes(SitioSharepointEncriptado, IdSolicitud, "Examen teórico");

                Solicitud["ExamenPsicotecnico"] = await ObtenerExamenes(SitioSharepointEncriptado, IdSolicitud, "Examen psicotécnico");

                Solicitud["ExamenPractico"] = await ObtenerExamenes(SitioSharepointEncriptado, IdSolicitud, "Examen práctico");

                return Solicitud;

            }

        }
        
        public async Task<List<Dictionary<string, object>>> ObtenerExamenes(string SitioSharepointEncriptado, int IdSolicitud, string Examen)
        {

            List<string> CamposVariables = new List<string>();

            string ListaExamen = string.Empty;

            switch (Examen)
            {

                case "Examen teórico":

                    ListaExamen = "Licencia_Etapa_ExamenTeorico";

                    CamposVariables.Add("Correctas");

                    CamposVariables.Add("Incorrectas");

                    CamposVariables.Add("PuntajePorcentual");

                    break;

                case "Examen psicotécnico":

                    ListaExamen = "Licencia_Etapa_ExamenPsicotecnico";

                    break;

                case "Examen práctico":

                    ListaExamen = "Licencia_Etapa_ExamenPractico";

                    break;

            }

            string SPO = DesencriptarSitioSPO(SitioSharepointEncriptado);

            using (var Context = await AuthenticationManager.GetContext(new Uri(SPO)))
            {


                var ListaSPO = await Context.Web.Lists.GetByTitleAsync(ListaExamen,

                    p => p.Title,

                    p => p.Fields.QueryProperties(

                        p => p.InternalName,

                        p => p.FieldTypeKind,

                        p => p.TypeAsString,

                        p => p.Title

                    )

                );

                string ViewXml =

                    @$"<View>

                        <ViewFields>

                            <FieldRef Name='FechaExamen' />

                            <FieldRef Name='HoraExamen' />

                            <FieldRef Name='Estado' />

                    ";

                foreach (var CampoVariable in CamposVariables)
                {

                    ViewXml += $"<FieldRef Name='{CampoVariable}' />";

                }
                ViewXml += @"
                        </ViewFields>

                        <Query>

                            <Where>

                                <Eq>

                                    <FieldRef Name='Solicitud' LookupId='True' />

                                    <Value Type='Lookup'>" + IdSolicitud + @"</Value>

                                </Eq>

                            </Where>

                        </Query>

                    </View>";

                await ListaSPO.LoadListDataAsStreamAsync(new RenderListDataOptions()
                {

                    ViewXml = ViewXml,

                    RenderOptions = RenderListDataOptionsFlags.None,

                    DatesInUtc = true

                });

                IEnumerable<IListItem> Items = ListaSPO.Items.AsRequested();

                List<Dictionary<string, object>> InformacionIterada = Iterar(Items);

                return InformacionIterada;

            }

        }

        #region Helpers

        public Dictionary<string, object> Limpiar(IListItem Item)
        {

            Dictionary<string, object> Elemento = new Dictionary<string, object>();

            var Propiedades = Item.Values;

            foreach (var Propiedad in Propiedades)
            {

                var Llave = Propiedad.Key;

                var Valor = Propiedad.Value;

                if (Llave == "Created")
                {

                    Propiedades.Remove("Created");

                }

                if (Llave == "Modified")
                {

                    Propiedades.Remove("Modified");

                }

                if (Llave == "Attachments")
                {

                    Propiedades.Remove("Attachments");

                }

                if (Llave == "ContentTypeId")
                {

                    Propiedades.Remove("ContentTypeId");

                }

                if (Llave == "FSObjType")
                {

                    Propiedades.Remove("FSObjType");

                }

                if (Llave == "FileRef")
                {

                    Propiedades.Remove("FileRef");

                }

                if (Llave == "FolderChildCount")
                {

                    Propiedades.Remove("FolderChildCount");

                }

                if (Llave == "ItemChildCount")
                {

                    Propiedades.Remove("ItemChildCount");

                }

                if (Llave == "PermMask")
                {

                    Propiedades.Remove("PermMask");

                }

                if (Llave == "Restricted")
                {

                    Propiedades.Remove("Restricted");

                }

                if (Llave == "SMTotalSize")
                {

                    Propiedades.Remove("SMTotalSize");

                }

                if (Llave == "ScopeId")
                {

                    Propiedades.Remove("ScopeId");

                }

                if (Llave == "UniqueId")
                {

                    Propiedades.Remove("UniqueId");

                }

                if (Llave == "owshiddenversion")
                {

                    Propiedades.Remove("owshiddenversion");

                }

                if (Llave == "_CommentCount")
                {

                    Propiedades.Remove("_CommentCount");

                }

                if (Llave == "_CommentFlags")
                {

                    Propiedades.Remove("_CommentFlags");

                }

                if (Valor is IFieldLookupValue)
                {

                    string LookupValue = (Valor as IFieldLookupValue).LookupValue;

                    if (LookupValue != null && LookupValue != "")
                    {

                        int LookupId = (Valor as IFieldLookupValue).LookupId;

                        Lookup Objeto = new Lookup(LookupId, LookupValue);

                        Item[Llave] = Objeto as object;

                    }

                    else
                    {

                        Item.Values.Remove(Llave);

                    }

                }

                if (Valor is IFieldValueCollection)
                {

                    List<int> ListaID = new List<int>();

                    foreach (IFieldLookupValue Lookup in (Valor as IFieldValueCollection).Values)
                    {

                        ListaID.Add(Lookup.LookupId);

                    }

                    Item[Llave] = ListaID;

                }

            }

            Item.Values.Add("Id", Item.Id);

            Elemento = Item.Values;

            return Elemento;

        }


        public List<Dictionary<string, object>> Iterar(IEnumerable<IListItem> Items)
        {

            List<Dictionary<string, object>> Elementos = new List<Dictionary<string, object>>();

            foreach (IListItem Item in Items)
            {

                var Propiedades = Item.Values;

                foreach (var Propiedad in Propiedades)
                {

                    var Llave = Propiedad.Key;

                    var Valor = Propiedad.Value;

                    if(Llave == "Created")
                    {

                        Propiedades.Remove("Created");

                    }

                    if (Llave == "Modified")
                    {

                        Propiedades.Remove("Modified");

                    }

                    if (Llave == "Attachments")
                    {

                        Propiedades.Remove("Attachments");

                    }

                    if (Llave == "ContentTypeId")
                    {

                        Propiedades.Remove("ContentTypeId");

                    }

                    if (Llave == "FSObjType")
                    {

                        Propiedades.Remove("FSObjType");

                    }

                    if (Llave == "FileRef")
                    {

                        Propiedades.Remove("FileRef");

                    }

                    if (Llave == "FolderChildCount")
                    {

                        Propiedades.Remove("FolderChildCount");

                    }

                    if (Llave == "ItemChildCount")
                    {

                        Propiedades.Remove("ItemChildCount");

                    }

                    if (Llave == "PermMask")
                    {

                        Propiedades.Remove("PermMask");

                    }

                    if (Llave == "Restricted")
                    {

                        Propiedades.Remove("Restricted");

                    }

                    if (Llave == "SMTotalSize")
                    {

                        Propiedades.Remove("SMTotalSize");

                    }

                    if (Llave == "ScopeId")
                    {

                        Propiedades.Remove("ScopeId");

                    }

                    if (Llave == "UniqueId")
                    {

                        Propiedades.Remove("UniqueId");

                    }

                    if (Llave == "owshiddenversion")
                    {

                        Propiedades.Remove("owshiddenversion");

                    }

                    if (Llave == "_CommentCount")
                    {

                        Propiedades.Remove("_CommentCount");

                    }

                    if (Llave == "_CommentFlags")
                    {

                        Propiedades.Remove("_CommentFlags");

                    }

                    if (Valor is IFieldLookupValue)
                    {

                        string LookupValue = (Valor as IFieldLookupValue).LookupValue;

                        if (LookupValue != null && LookupValue != "")
                        {

                            int LookupId = (Valor as IFieldLookupValue).LookupId;

                            Lookup Objeto = new Lookup(LookupId, LookupValue);

                            Item[Llave] = Objeto as object;

                        }

                        else
                        {

                            Item.Values.Remove(Llave);

                        }

                    }

                    if (Valor is IFieldValueCollection)
                    {

                        List<int> ListaID = new List<int>();

                        foreach (IFieldLookupValue Lookup in (Valor as IFieldValueCollection).Values)
                        {

                            ListaID.Add(Lookup.LookupId);

                        }

                        Item[Llave] = ListaID;

                    }

                }

                Item.Values.Add("Id", Item.Id);

                Elementos.Add(Item.Values);

            }

            return Elementos;

        }

        public string DesencriptarSitioSPO (string SitioSharepoint)
        {

            string KeySPO = Configuration.GetValue<string>("KeySPO");

            byte[] toEncryptArray = Convert.FromBase64String(SitioSharepoint);

            MD5CryptoServiceProvider objMD5CryptoService = new MD5CryptoServiceProvider();

            //Gettting the bytes from the Security Key and Passing it to compute the Corresponding Hash Value.
            byte[] securityKeyArray = objMD5CryptoService.ComputeHash(UTF8Encoding.UTF8.GetBytes(KeySPO));

            objMD5CryptoService.Clear();

            var objTripleDESCryptoService = new TripleDESCryptoServiceProvider();

            //Assigning the Security key to the TripleDES Service Provider.
            objTripleDESCryptoService.Key = securityKeyArray;

            //Mode of the Crypto service is Electronic Code Book.
            objTripleDESCryptoService.Mode = CipherMode.ECB;

            //Padding Mode is PKCS7 if there is any extra byte is added.
            objTripleDESCryptoService.Padding = PaddingMode.PKCS7;

            var objCrytpoTransform = objTripleDESCryptoService.CreateDecryptor();

            //Transform the bytes array to resultArray
            byte[] resultArray = objCrytpoTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

            objTripleDESCryptoService.Clear();

            //Convert and return the decrypted data/byte into string format.
            return UTF8Encoding.UTF8.GetString(resultArray);

        }


        #endregion

    }

}
