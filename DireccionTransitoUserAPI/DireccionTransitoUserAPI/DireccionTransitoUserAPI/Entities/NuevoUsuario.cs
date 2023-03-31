using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoUserAPI.Entities
{
    public class NuevoUsuario
    {

        public NuevoUsuario(string correo, string contraseña, string nombres, string apellidos, DateTime fechaNacimiento, string rut, string numeroContacto, string direccion, string region, string comuna)
        {

            Correo = correo;

            Contraseña = contraseña;

            Nombres = nombres;

            Apellidos = apellidos;

            FechaNacimiento = fechaNacimiento;

            Rut = rut;

            NumeroContacto = numeroContacto;

            Direccion = direccion;

            Region = region;

            Comuna = comuna;

        }

        [Required]
        public string Correo { get; set; }

        [Required]
        public string Contraseña { get; set; }

        [Required]
        public string Nombres { get; set; }

        [Required]
        public string Apellidos { get; set; }

        [Required]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        public string Rut { get; set; }

        [Required]
        public string NumeroContacto { get; set; }

        [Required]
        public string Direccion { get; set; }

        [Required]
        public string Region { get; set; }

        [Required]
        public string Comuna { get; set; }

    }

}
