using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoBussinesAPI.Entities
{
    public class Examen
    {

        [Required] public int IdSolicitud { get; set; }

        [Required] public DateTime FechaExamen { get; set; }

        [Required] public int HoraExamen { get; set; }

        [Required] public int EtapaActual { get; set; }

    }
}
