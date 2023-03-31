using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoUserAPI.Entities
{
    public class CorreoUsuario
    {
        public CorreoUsuario(string correo)
        {

            Correo = correo;

        }

        [Required]
        public string Correo { get; set; }

    }

}
