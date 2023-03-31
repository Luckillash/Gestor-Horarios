using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoDataAPI.Entities
{
    public class FechaSeleccionada
    {

        [Required] public DateTime Fecha { get; set; }

    }
}
