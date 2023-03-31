using DireccionTransitoUserAPI.Entities;
using DireccionTransitoUserAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.VisualBasic;
using MySql.Data.MySqlClient;
using System;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using static System.Net.WebRequestMethods;

namespace DireccionTransitoUserAPI.Controllers
{

    [Route("/DireccionTransitoUserAPI/")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IConfiguration Configuration;

        private readonly IUserService UserService;

        public UserController(IUserService userService, IConfiguration configuration)
        {

            UserService = userService;

            Configuration = configuration;

        }

        [HttpPost, Route("RegistrarUsuario")]
        public IActionResult RegistrarUsuario([FromBody] NuevoUsuario NuevoUsuario)
        {

            #region Datos nuevo usuario

            string Correo = NuevoUsuario.Correo;

            string Contraseña = NuevoUsuario.Contraseña;

            string Nombres = NuevoUsuario.Nombres;

            string Apellidos = NuevoUsuario.Apellidos;

            DateTime FechaNacimiento = NuevoUsuario.FechaNacimiento;

            string Rut = NuevoUsuario.Rut;

            string NumeroContacto = NuevoUsuario.NumeroContacto;

            string Region = NuevoUsuario.Region;

            string Comuna = NuevoUsuario.Comuna;

            string Direccion = NuevoUsuario.Direccion;

            #endregion

            #region Validacion Regex

            Regex RegexCorreo = new Regex(@"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

            Regex RegexContraseña = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{10,}$");

            bool CorreoValido = RegexCorreo.IsMatch(Correo);

            bool ContraseñaValida = RegexContraseña.IsMatch(Contraseña);

            if (!CorreoValido) throw new Exception("Correo no válido");

            if (!ContraseñaValida) throw new Exception("La contraseña debe contener: 1 mayúscula, 1 minúscula, 1 carácter especial (@ - # - $, etc) y tener un largo de 8 carácteres.");

            #endregion

            try
            {

                UserService.RegistrarUsuario(Correo, Contraseña, Nombres, Apellidos, FechaNacimiento, Rut, NumeroContacto, Region, Comuna, Direccion);

                return Ok("El registro fue un éxito, te enviamos un correo de activación, tienes 2 horas para activar tu cuenta.");

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpPost, Route("ActivarUsuario")]
        public IActionResult ActivarUsuario([FromBody] ActivacionUsuario ActivacionUsuario)
        {

            #region Datos activación usuario

            string TokenDeActivacion = ActivacionUsuario.Token;

            string Correo = ActivacionUsuario.Correo;

            string Contraseña = ActivacionUsuario.Contraseña;

            #endregion

            #region Validacion Regex

            Regex RegexCorreo = new Regex(@"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

            Regex RegexContraseña = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{10,}$");

            bool CorreoValido = RegexCorreo.IsMatch(Correo);

            bool ContraseñaValida = RegexContraseña.IsMatch(Contraseña);

            if (!CorreoValido) throw new Exception("Correo no válido");

            if (!ContraseñaValida) throw new Exception("La contraseña debe contener: 1 mayúscula, 1 minúscula, 1 carácter especial (@ - # - $, etc) y tener un largo de 8 carácteres.");

            #endregion

            try
            {

                UserService.ActivarUsuario(TokenDeActivacion, Correo, Contraseña);

                return Ok("¡Su cuenta fue activada con éxito!");

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpPost, Route("AccederUsuario")]
        public IActionResult AccederUsuario([FromBody] CredencialesUsuario CredencialesUsuario)
        {

            #region Credenciales del usuario

            string Correo = CredencialesUsuario.Correo;

            string Contraseña = CredencialesUsuario.Contraseña;

            #endregion

            #region Validacion Regex

            Regex RegexCorreo = new Regex(@"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

            Regex RegexContraseña = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{10,}$");

            bool CorreoValido = RegexCorreo.IsMatch(Correo);

            bool ContraseñaValida = RegexContraseña.IsMatch(Contraseña);

            if (!CorreoValido) throw new Exception("Correo no válido");

            if (!ContraseñaValida) throw new Exception("La contraseña debe contener: 1 mayúscula, 1 minúscula, 1 carácter especial (@ - # - $, etc) y tener un largo de 8 carácteres.");

            #endregion

            try
            {

                List<TokenEstandar> ListaTokens = UserService.AccederUsuario(Correo, Contraseña);

                GenerarCookie(ListaTokens[0], "IdSesion");

                GenerarCookie(ListaTokens[1], "SPO");

                string JWT = GenerarJWT();

                return Ok(JWT);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpGet, Route("ObtenerUsuario"), Authorize]
        public IActionResult ObtenerUsuario()
        {

            string? Sesion = Request.Cookies["IdSesion"];

            if (Sesion == null) throw new Exception("No autorizado");

            try
            {

                Usuario Usuario = UserService.ObtenerUsuario(Sesion);

                return Ok(Usuario);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }


        }

        [HttpGet, Route("RefrescarCookies")]
        public IActionResult RefrescarCookies()
        {

            string? Sesion = Request.Cookies["IdSesion"];

            if (Sesion == null) throw new Exception("No autorizado");

            try
            {

                TokenEstandar IdSesion = UserService.RefrescarCookies(Sesion);

                GenerarCookie(IdSesion, "IdSesion");

                string JWT = GenerarJWT();

                return Ok(JWT);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpGet, Route("ValidarSesion")]
        public IActionResult ValidarSesion()
        {

            string? Sesion = Request.Cookies["IdSesion"];

            if (Sesion == null) throw new Exception("No autorizado");

            try
            {

                bool SesionValida = UserService.ValidarSesion(Sesion);

                return Ok(SesionValida);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(false);

            }

        }

        [HttpPost, Route("SolicitarCambioContraseña")]
        public IActionResult SolicitarCambioContraseña([FromBody] CorreoUsuario CorreoUsuario)
        {

            string Correo = CorreoUsuario.Correo;

            #region Validacion Regex

            Regex RegexCorreo = new Regex(@"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

            bool CorreoValido = RegexCorreo.IsMatch(Correo);

            if (!CorreoValido) throw new Exception("Correo no válido");

            #endregion

            try
            {

                UserService.SolicitarCambioContraseña(Correo);

                return Ok("¡La solicitud fue un éxito!, te enviamos un correo de recuperación");

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpPost, Route("CambiarContraseña")]
        public IActionResult CambiarContraseña([FromBody] CambioContraseña CambioContraseña)
        {

            #region Datos cambio de contraseña

            string TokenDeCambioContraseña = CambioContraseña.Token;

            string Correo = CambioContraseña.Correo;

            string NuevaContraseña = CambioContraseña.NuevaContraseña;

            #endregion

            #region Validacion Regex

            Regex RegexCorreo = new Regex(@"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

            Regex RegexContraseña = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{10,}$");

            bool CorreoValido = RegexCorreo.IsMatch(Correo);

            bool ContraseñaValida = RegexContraseña.IsMatch(NuevaContraseña);

            if (!CorreoValido) throw new Exception("Correo no válido");

            if (!ContraseñaValida) throw new Exception("La contraseña debe contener: 1 mayúscula, 1 minúscula, 1 carácter especial (@ - # - $, etc) y tener un largo de 8 carácteres.");

            #endregion

            try
            {

                UserService.CambiarContraseña(TokenDeCambioContraseña, NuevaContraseña, Correo);

                return Ok("¡Tu contraseña fue cambiada cón éxito!");

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        #region Helpers

        private string GenerarJWT()
        {

            string Issuer = Configuration.GetValue<string>("JWT_Issuer");

            string JWT_Key = Configuration.GetValue<string>("JWT_Secret_Key");

            byte[] Key = Encoding.UTF8.GetBytes(JWT_Key);

            var LlaveSeguridad = new SymmetricSecurityKey(Key);

            var Credenciales = new SigningCredentials(LlaveSeguridad, SecurityAlgorithms.HmacSha256);

            var Token = new JwtSecurityToken(

                Issuer,

                Issuer,

                null,

                expires: DateTime.Now.AddMinutes(120),

                signingCredentials: Credenciales);

            return new JwtSecurityTokenHandler().WriteToken(Token);

        }

        private void GenerarCookie(TokenEstandar TokenEstandar, string NombreCookie)
        {

            DateTime Expiracion = TokenEstandar.Expiracion;

            CookieOptions CookieOptions = new CookieOptions();

            CookieOptions.HttpOnly = true;

            CookieOptions.Expires = Expiracion;

            CookieOptions.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;

            CookieOptions.Secure = true;

            //CookieOptions.Domain = "localhost:3000";

            Response.Cookies.Append(NombreCookie, TokenEstandar.Token, CookieOptions);

        }

        #endregion

    }

}
