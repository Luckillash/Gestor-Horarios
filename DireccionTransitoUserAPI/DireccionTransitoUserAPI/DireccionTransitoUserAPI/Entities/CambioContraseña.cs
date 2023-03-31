using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoUserAPI.Entities
{

    public class CambioContraseña
    {

        public CambioContraseña(string token, string correo, string nuevaContraseña)
        {
            Token = token;
            Correo = correo;
            NuevaContraseña = nuevaContraseña;
        }

        [Required]
        public string Token { get; set; }

        [Required]

        public string Correo { get; set; }

        [Required]
        public string NuevaContraseña { get; set; }

    }

}
