using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoUserAPI.Entities
{
    public class CredencialesUsuario
    {

        public CredencialesUsuario(string correo, string contraseña)
        {

            Correo = correo;

            Contraseña = contraseña;

        }

        [Required]
        public string Correo { get; set; }

        [Required]
        public string Contraseña { get; set; }

    }

}
