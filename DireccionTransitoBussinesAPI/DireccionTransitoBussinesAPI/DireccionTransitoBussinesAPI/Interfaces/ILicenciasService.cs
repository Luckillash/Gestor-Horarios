using DireccionTransitoBussinesAPI.Entities;

namespace DireccionTransitoBussinesAPI.Interfaces
{
    public interface ILicenciasService
    {

        Task<int> GenerarSolicitud(NuevaLicencia NuevaLicencia);

        Task GenerarExamen(Examen Examen);

        Task AvanzarEtapa(Avance Avance);

    }

}
