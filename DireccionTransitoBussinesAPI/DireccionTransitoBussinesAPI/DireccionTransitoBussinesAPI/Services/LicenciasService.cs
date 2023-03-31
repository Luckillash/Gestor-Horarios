using DireccionTransitoBussinesAPI.Entities;
using DireccionTransitoBussinesAPI.Interfaces;
using PnP.Core.Model.SharePoint;
using PnP.Core.QueryModel;
using PnP.Core.Services;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace DireccionTransitoBussinesAPI.Services
{
    public class LicenciasService : ILicenciasService
    {

        private readonly IConfiguration Configuration;

        private readonly IAuthenticationManager AuthenticationManager;

        public LicenciasService(IAuthenticationManager authenticationManager, IConfiguration configuration)
        {

            AuthenticationManager = authenticationManager;

            Configuration = configuration;

        }

        public async Task<int> GenerarSolicitud(NuevaLicencia NuevaLicencia)
        {

            int TipoSolicitud = NuevaLicencia.TipoSolicitud;

            using (var Context = await AuthenticationManager.GetContext(new Uri("https://direcciontransito.sharepoint.com/sites/TransitoTome")))
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

                Dictionary<string, object> NuevaSolicitud = new Dictionary<string, object>();

                string Rut = NuevaLicencia.Rut;

                #region Valores por defecto

                var EtapasSolicitud = new FieldValueCollection();

                int EtapaActual;

                if (TipoSolicitud == 1) {

                    EtapaActual = 1;

                    var EtapaActualLookup = new FieldLookupValue(EtapaActual);

                    NuevaSolicitud.Add("EtapaActual", EtapaActual);

                    EtapasSolicitud.Values.Add(new FieldLookupValue(1));

                    EtapasSolicitud.Values.Add(new FieldLookupValue(2));

                    EtapasSolicitud.Values.Add(new FieldLookupValue(3));

                    EtapasSolicitud.Values.Add(new FieldLookupValue(4));

                    EtapasSolicitud.Values.Add(new FieldLookupValue(5));

                }

                else
                {

                    EtapaActual = 2;

                    var EtapaActualLookup = new FieldLookupValue(EtapaActual);

                    NuevaSolicitud.Add("EtapaActual", EtapaActual);

                    EtapasSolicitud.Values.Add(new FieldLookupValue(2));

                    EtapasSolicitud.Values.Add(new FieldLookupValue(4));

                    EtapasSolicitud.Values.Add(new FieldLookupValue(5));

                }

                NuevaSolicitud.Add("EtapasSolicitud", EtapasSolicitud);

                #endregion

                #region Valores usuario

                PropertyInfo[] Propiedades = NuevaLicencia.GetType().GetProperties();

                foreach (PropertyInfo Propiedad in Propiedades)
                {

                    string LlavePropiedad = Propiedad.Name;

                    dynamic ValorPropiedad = Propiedad.GetValue(NuevaLicencia).ToString();

                    if (Propiedad.PropertyType.Name == "DateTime") ValorPropiedad = DateTime.Parse(ValorPropiedad).Subtract(new TimeSpan(10, 0, 0, 0));

                    if (LlavePropiedad == "TipoSolicitud") ValorPropiedad = new FieldLookupValue(int.Parse(ValorPropiedad));

                    if (LlavePropiedad == "Licencia") ValorPropiedad = new FieldLookupValue(int.Parse(ValorPropiedad));

                    NuevaSolicitud.Add(LlavePropiedad, ValorPropiedad);

                }

                var Solicitud = await ListaSPO.Items.AddAsync(NuevaSolicitud);

                #endregion

                #region Obtener id solicitud

                int IdSolicitud = Solicitud.Id;

                #endregion

                #region Generar carpeta

                bool ExisteCarpeta = false;

                try
                {

                    var Carpeta = await Context.Web.GetFolderByServerRelativeUrlAsync($"{Context.Uri.PathAndQuery}/Licencia_Documentos");

                    await foreach (var Subcarpeta in Carpeta.Folders)
                    {

                        if (Subcarpeta.Name == Rut) ExisteCarpeta = true;
                        
                    }

                    if (!ExisteCarpeta) {

                        var subFolder = await Carpeta.Folders.AddAsync(Rut);

                    }

                }

                catch
                {

                }


                #endregion

                return IdSolicitud;

            }

        }

        public async Task GenerarExamen(Examen Examen)
        {

            int EtapaActual = Examen.EtapaActual;

            int IdSolicitud = Examen.IdSolicitud;

            DateTime FechaExamen = Examen.FechaExamen;

            int HoraExamen = Examen.HoraExamen;

            using (var Context = await AuthenticationManager.GetContext(new Uri("https://direcciontransito.sharepoint.com/sites/TransitoTome")))
            {

                string ListaExamen = string.Empty;

                string CampoExamen = string.Empty;

                #region Subir examen

                switch (EtapaActual)
                {

                    case 1:

                        ListaExamen = "Licencia_Etapa_ExamenTeorico";

                        CampoExamen = "ExamenTeorico";


                        break;

                    case 2:

                        ListaExamen = "Licencia_Etapa_ExamenPsicotecnico";

                        CampoExamen = "ExamenPsicotecnico";

                        break;

                    case 3:

                        ListaExamen = "Licencia_Etapa_ExamenPractico";

                        CampoExamen = "ExamenPractico";

                        break;

                    default:

                        break;

                }

                var ListaSPO = await Context.Web.Lists.GetByTitleAsync(ListaExamen,

                    p => p.Title,

                    p => p.Fields.QueryProperties(

                        p => p.InternalName,

                        p => p.FieldTypeKind,

                        p => p.TypeAsString,

                        p => p.Title

                    )
                );

                FieldLookupValue IdSolicitudLookup = new FieldLookupValue(IdSolicitud);

                FieldLookupValue HoraExamenLookup = new FieldLookupValue(HoraExamen);

                Dictionary<string, object> NuevoExamen = new Dictionary<string, object>
                {

                    { "Solicitud", IdSolicitudLookup },

                    { "FechaExamen", FechaExamen },

                    { "HoraExamen", HoraExamenLookup }

                };

                var ExamenSubido = await ListaSPO.Items.AddAsync(NuevoExamen);

                int IdExamenSubido = ExamenSubido.Id;

                #endregion

                var ListaSPO2 = await Context.Web.Lists.GetByTitleAsync("Licencia_Hechos_Solicitudes",

                    p => p.Title,

                    p => p.Fields.QueryProperties(

                        p => p.InternalName,

                        p => p.FieldTypeKind,

                        p => p.TypeAsString,

                        p => p.Title

                    )
                );

                var SolicitudPorActualizar = await ListaSPO2.Items.GetByIdAsync(IdSolicitud);

                FieldLookupValue CampoExamenLookup = new FieldLookupValue(IdExamenSubido);

                SolicitudPorActualizar[CampoExamen] = CampoExamenLookup;

                await SolicitudPorActualizar.UpdateAsync();

            }

        }

        public async Task AvanzarEtapa(Avance Avance)
        {

            int SolicitudId = Avance.SolicitudId;

            int EtapaActualId = Avance.EtapaActualId;

            using (var Context = await AuthenticationManager.GetContext(new Uri("https://direcciontransito.sharepoint.com/sites/TransitoTome")))
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

                var SolicitudPorActualizar = await ListaSPO.Items.GetByIdAsync(SolicitudId);

                FieldLookupValue CampoEtapaActualLookup = new FieldLookupValue(EtapaActualId + 1);

                SolicitudPorActualizar["EtapaActual"] = CampoEtapaActualLookup;

                await SolicitudPorActualizar.UpdateAsync();

            }

        }

    }

}
