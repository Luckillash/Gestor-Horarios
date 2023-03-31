using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoBussinesAPI.Entities
{
    public class Avance
    {

        [Required] public int SolicitudId { get; set; }

        [Required] public int EtapaActualId { get; set; }


    }
}
