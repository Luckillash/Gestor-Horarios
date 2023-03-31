using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoUserAPI.Entities
{
    public class Cookies
    {

        [Required]
        public TokenEstandar IdSesion { get; set; } = new TokenEstandar();

        [Required]
        public string TokenJWT { get; set; } = string.Empty;

    }
}
