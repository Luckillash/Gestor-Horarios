using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoDataAPI.Entities
{
    public class Horario
    {

        [Required] public DateTime Fecha { get; set; }

        [Required] public string Lista { get; set; } = string.Empty;

    }

}
