using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoDataAPI.Entities
{
    public class Examen
    {

        [Required] public int IdSolicitud { get; set; }

        [Required] public string TipoExamen { get; set; } = string.Empty;

    }
}
