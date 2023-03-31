using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoUserAPI.Entities
{

    public class ActivacionUsuario
    {

        public ActivacionUsuario (string token, string correo, string contraseña)
        {

            Token = token;

            Correo = correo;

            Contraseña = contraseña;

        }

        [Required]
        public string Token { get; set; }

        [Required]
        public string Correo { get; set; }

        [Required]
        public string Contraseña { get; set; }

    }

}
