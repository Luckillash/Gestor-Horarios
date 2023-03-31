using DireccionTransitoUserAPI.Entities;

namespace DireccionTransitoUserAPI.Interfaces
{
    public interface IUserService
    {
        void RegistrarUsuario(string Correo, string Contraseña, string Nombres, string Apellidos, DateTime FechaNacimiento, string Rut, string NumeroContacto, string Region, string Comuna, string Direccion);

        void ActivarUsuario(string TokenDeActivacion, string Correo, string Contraseña);

        List<TokenEstandar> AccederUsuario(string Correo, string Contraseña);

        Usuario ObtenerUsuario(string? Sesion);

        TokenEstandar RefrescarCookies(string? Sesion);

        bool ValidarSesion(string? Sesion);

        public void SolicitarCambioContraseña(string Correo);

        void CambiarContraseña(string TokenDeCambioDeContraseña, string NuevaContraseña, string Correo);

    }

}
