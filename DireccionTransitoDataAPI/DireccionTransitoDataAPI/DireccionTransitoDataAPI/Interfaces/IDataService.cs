using DireccionTransitoDataAPI.Entities;

namespace DireccionTransitoDataAPI.Interfaces
{
    public interface IDataService
    {

        Task<List<Dictionary<string, object>>> ObtenerEtapas(string SitioSharepointEncriptado);

        Task<List<Dictionary<string, object>>> ObtenerSolicitudes(string SitioSharepointEncriptado, int IdUsuario);

        Task<Dictionary<string, object>> ObtenerSolicitud(string SitioSharepointEncriptado, int IdSolicitud);

        Task<List<Dictionary<string, object>>> ObtenerLicencias(string SitioSharepointEncriptado);

        Task<List<Dictionary<string, object>>> ObtenerHorarios(string SitioSharepointEncriptado);

        Task<List<Dictionary<string, object>>> ObtenerHorariosOcupados(string SitioSharepointEncriptado, DateTime Fecha, string Lista);

        Task<List<Dictionary<string, object>>> ObtenerExamenes(string SitioSharepointEncriptado, int IdSolicitud, string Examen);

    }

}
