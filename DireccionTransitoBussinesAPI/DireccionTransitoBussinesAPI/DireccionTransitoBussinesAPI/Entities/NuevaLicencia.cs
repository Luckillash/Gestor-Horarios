using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoBussinesAPI.Entities
{
    public class NuevaLicencia
    {

        [Required] public int IDUsuario { get; set; }

        [Required] public string Nombres { get; set; } = string.Empty;

        [Required] public string Apellidos { get; set; } = string.Empty;

        [Required] public string Rut { get; set; } = string.Empty;

        [Required] public DateTime FechaNacimiento { get; set; }

        [Required] public string Direccion { get; set; } = string.Empty;

        [Required] public string Email { get; set; } = string.Empty;

        [Required] public string NumeroContacto { get; set; } = string.Empty;

        [Required] public int TipoSolicitud { get; set; }

        [Required] public int Licencia { get; set; }

        [Required] public DateTime FechaInicio { get; set; }

    }

}
