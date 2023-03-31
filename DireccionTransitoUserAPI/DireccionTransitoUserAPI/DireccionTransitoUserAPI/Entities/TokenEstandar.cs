namespace DireccionTransitoUserAPI.Entities
{
    public class TokenEstandar
    {

        public string Token { get; set; } = string.Empty;

        public DateTime Creacion { get; set; } = DateTime.Now;

        public DateTime Expiracion { get; set; }

    }

}
