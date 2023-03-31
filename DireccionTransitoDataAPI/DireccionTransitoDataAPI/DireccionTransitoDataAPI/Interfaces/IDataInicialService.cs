using DireccionTransitoDataAPI.Entities;

namespace DireccionTransitoDataAPI.Interfaces
{
    public interface IDataInicialService
    {

        List<string> ObtenerRegiones();

        List<Comunas> ObtenerComunas();

    }

}
