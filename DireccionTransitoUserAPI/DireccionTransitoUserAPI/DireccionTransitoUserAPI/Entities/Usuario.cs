namespace DireccionTransitoUserAPI.Entities
{
    public class Usuario
    {

        public int IdUsuario { get; set; }

        public string Correo { get; set; }

        public string Nombres { get; set; }

        public string Apellidos { get; set; }

        public string NombreCompleto { get; set; }

        public string Rut { get; set; }

        public DateTime FechaNacimiento { get; set; }

        public string Region { get; set; }

        public string Comuna { get; set; }

        public string Direccion { get; set; }

        public string NumeroContacto { get; set; }

    }

}
