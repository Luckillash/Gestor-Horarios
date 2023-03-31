using DireccionTransitoUserAPI.Entities;
using DireccionTransitoUserAPI.Interfaces;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;

namespace DireccionTransitoAPI.Services
{
    public class UserService : IUserService
    {

        private readonly IConfiguration Configuration;

        private readonly IMySQL MySQL;

        public UserService(IMySQL mySQL, IConfiguration configuration)
        {

            MySQL = mySQL;

            Configuration = configuration;

        }

        public void RegistrarUsuario(string Correo, string Contraseña, string Nombres, string Apellidos, DateTime FechaNacimiento, string Rut, string NumeroContacto, string Region, string Comuna, string Direccion)
        {

            using (var Conexion = MySQL.ConexionMySQL("direcciontransitousers"))
            {

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                #region Verificar si existe usuario (Excepción)

                Peticion.CommandText = @$"SELECT correo FROM direcciontransitousers.usuarios

                    WHERE Correo = '{Correo}'

                    OR Rut = '{Rut}';";

                Peticion.ExecuteNonQuery();

                bool ExisteUsuario = false;

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        ExisteUsuario = true;

                    }

                }

                if (ExisteUsuario) throw new Exception("Ya existe un usuario con estas credenciales.");

                #endregion

                #region Generar usuario

                string ContraseñaEncriptada = EncriptarContraseña(Contraseña);

                string FechaNacimientoString = FechaNacimiento.ToString("yyyy/MM/dd");

                Peticion.CommandText = @$"INSERT 

                    INTO direcciontransitousers.usuarios(Correo, Contraseña, Nombres, Apellidos, FechaNacimiento, Rut, NumeroContacto, Region, Comuna, Direccion)

                    VALUES('{Correo}', '{ContraseñaEncriptada}', '{Nombres}', '{Apellidos}', '{FechaNacimientoString}', '{Rut}', '{NumeroContacto}', '{Region}', '{Comuna}', '{Direccion}');";

                Peticion.ExecuteNonQuery();

                long IdUsuarioSubido = Peticion.LastInsertedId;

                #endregion

                #region Generar token de activación, verificar que no existe y subirlo (100B)

                TokenEstandar TokenActivacion = new TokenEstandar();

                string Token = string.Empty;

                string Expiracion = string.Empty;

                bool ExisteToken = false;

                while (!ExisteToken)
                {

                    TokenActivacion = GenerarTokenEstandar(100);

                    Token = TokenActivacion.Token;

                    Expiracion = TokenActivacion.Expiracion.ToString("yyyy-MM-dd H:mm:ss");

                    Peticion.CommandText = @$"SELECT TokenActivacion FROM direcciontransitousers.usuarios
                    
                        WHERE TokenActivacion = '{Token}';";

                    Peticion.ExecuteNonQuery();

                    using (MySqlDataReader Reader = Peticion.ExecuteReader())
                    {

                        while (Reader.Read())
                        {

                            ExisteToken = true;

                        }

                    }

                    if (!ExisteToken) break;

                }

                Peticion.CommandText = @$"UPDATE direcciontransitousers.usuarios
                    
                    SET TokenActivacion = '{Token}',

                        TokenActivacionExpiracion = '{Expiracion}'
                    
                    WHERE IdUsuario = {IdUsuarioSubido};";

                Peticion.ExecuteNonQuery();

                #endregion

                #region Enviar correo de activación

                string UrlDeActivacion = $"https://localhost:3000/ActivarUsuario/{Token}";

                SmtpClient Cliente = new SmtpClient("smtp-mail.outlook.com");

                Cliente.Port = 587;

                Cliente.DeliveryMethod = SmtpDeliveryMethod.Network;

                Cliente.UseDefaultCredentials = false;

                System.Net.NetworkCredential Credenciales = new System.Net.NetworkCredential("lucassalazarc@outlook.com", "Dragonazul020201");

                Cliente.EnableSsl = true;

                Cliente.Credentials = Credenciales;

                MailMessage CorreoDeActivacion = new MailMessage("lucassalazarc@outlook.com", Correo);

                CorreoDeActivacion.Subject = "¡Tu registro fue un éxito!, activa tu cuenta | Dirección del tránsito";

                CorreoDeActivacion.Body = @$"

                    <h1> Te haz registrado </h1 >

                    <p> Por favor ingresa a este link para activar tu cuenta </p>

                    <a href={UrlDeActivacion} clicktracking=off> Activa tu cuenta </a> ";

                CorreoDeActivacion.IsBodyHtml = true;

                Cliente.Send(CorreoDeActivacion);

                #endregion

            }

        }

        public void ActivarUsuario(string TokenDeActivacion, string Correo, string Contraseña)
        {

            using (var Conexion = MySQL.ConexionMySQL("direcciontransitousers"))
            {

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                #region Verificar que el usuario no esté activo y la activación no haya expirado (Excepción)

                string ContraseñaEncriptada = EncriptarContraseña(Contraseña);

                Peticion.CommandText = @$"SELECT IdUsuario
            
                    FROM direcciontransitousers.usuarios 
                    
                    WHERE TokenActivacion = '{TokenDeActivacion}'

                    AND TokenActivacionExpiracion > NOW()

                    AND Correo = '{Correo}'

                    AND Contraseña = '{ContraseñaEncriptada}'

                    AND Activado = FALSE;";

                Peticion.ExecuteNonQuery();

                int IdUsuario = 0;

                bool ExisteUsuario = false;

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        IdUsuario = Reader.GetInt32(0);

                        ExisteUsuario = true;

                    }

                }

                if(!ExisteUsuario) throw new Exception("Ocurrió un error al activar la cuenta");

                #endregion

                #region Activar usuario

                Peticion.CommandText = @$"UPDATE direcciontransitousers.usuarios

                    SET TokenActivacion = NULL,

                        TokenActivacionExpiracion = NULL,

	                    Activado = TRUE

                    WHERE IdUsuario = {IdUsuario}

                    AND Correo = '{Correo}'

                    AND Contraseña = '{ContraseñaEncriptada}'

                    AND Activado = FALSE;";

                Peticion.ExecuteNonQuery();

                #endregion

            }

        }

        public List<TokenEstandar> AccederUsuario(string Correo, string Contraseña)
        {

            List<TokenEstandar> ListaTokens = new List<TokenEstandar>();

            TokenEstandar IdSesion = new TokenEstandar();

            TokenEstandar SitioSPO = new TokenEstandar();

            string ContraseñaEncriptada = EncriptarContraseña(Contraseña);

            string Comuna = string.Empty;

            string Sharepoint = string.Empty;

            #region Id de sesión

            using (var Conexion = MySQL.ConexionMySQL("direcciontransitousers"))
            {

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                #region Verificar si existe usuario (Excepción)

                Peticion.CommandText = @$"SELECT Correo, Nombres, Apellidos, NombreCompleto, Rut, FechaNacimiento, Region, Comuna, Direccion, NumeroContacto
            
                    FROM direcciontransitousers.usuarios 
                    
                    WHERE Correo = '{Correo}'

                    AND Contraseña = '{ContraseñaEncriptada}'

                    AND Activado = TRUE;";

                Peticion.ExecuteNonQuery();

                bool ExisteUsuario = false;

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        ExisteUsuario = true;

                        Comuna = Reader.GetString(7);

                    }

                }

                if(!ExisteUsuario) throw new Exception("Credenciales incorrectas");

                #endregion

                #region Generar Id de sesion (Cookie + DB)

                string Token = string.Empty;

                string Expiracion = string.Empty;

                bool ExisteIdSesion = false;

                while (!ExisteIdSesion)
                {

                    IdSesion = GenerarTokenEstandar(82);

                    Token = IdSesion.Token;

                    Expiracion = IdSesion.Expiracion.ToString("yyyy-MM-dd H:mm:ss");

                    Peticion.CommandText = @$"SELECT IdSesion FROM direcciontransitousers.usuarios
                    
                    WHERE IdSesion = '{Token}';";

                    Peticion.ExecuteNonQuery();

                    using (MySqlDataReader Reader = Peticion.ExecuteReader())
                    {

                        while (Reader.Read())
                        {

                            ExisteIdSesion = true;

                        }

                    }

                    if (!ExisteIdSesion) break;

                }

                ListaTokens.Add(IdSesion);

                Peticion.CommandText = @$"UPDATE direcciontransitousers.usuarios

                    SET IdSesion = '{Token}',

                        IdSesionExpiracion = '{Expiracion}'

                    WHERE Correo = '{Correo}'

                    AND Contraseña = '{ContraseñaEncriptada}'

                    AND Activado = TRUE;";

                Peticion.ExecuteNonQuery();

                #endregion


            }

            #endregion

            #region Obtener sitio de SPO

            using (var Conexion = MySQL.ConexionMySQL("direcciontransitoinitialdata"))
            {

                bool ExisteComuna = false;

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                Peticion.CommandText = @$"SELECT Sharepoint
            
                    FROM direcciontransitoinitialdata.comunas 
                    
                    WHERE Comuna = '{Comuna}';";

                Peticion.ExecuteNonQuery();


                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        ExisteComuna = true;

                        Sharepoint = Reader.GetString(0);

                    }

                }

                SitioSPO = GenerarTokenEncriptado(Sharepoint);

                ListaTokens.Add(SitioSPO);

            }

            #endregion

            return ListaTokens;

        }

        public Usuario ObtenerUsuario(string? Sesion)
        {

            Usuario Usuario = new Usuario();

            using (var Conexion = MySQL.ConexionMySQL("direcciontransitousers"))
            {

                #region Obtener data de usuario

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                Peticion.CommandText = @$"SELECT Correo, Nombres, Apellidos, NombreCompleto, Rut, FechaNacimiento, Region, Comuna, Direccion, NumeroContacto, IdUsuario
            
                    FROM direcciontransitousers.usuarios 
                    
                    WHERE IdSesion = '{Sesion}'

                    AND Activado = TRUE;";

                bool ExisteUsuario = false;

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        Usuario.Correo = Reader.GetString(0);

                        Usuario.Nombres = Reader.GetString(1);

                        Usuario.Apellidos = Reader.GetString(2);

                        Usuario.NombreCompleto = Reader.GetString(2);

                        Usuario.Rut = Reader.GetString(4);

                        Usuario.FechaNacimiento = Reader.GetDateTime(5);

                        Usuario.Region = Reader.GetString(6);

                        Usuario.Comuna = Reader.GetString(7);

                        Usuario.Direccion = Reader.GetString(8);

                        Usuario.NumeroContacto = Reader.GetString(9);

                        Usuario.IdUsuario = Reader.GetInt32(10);

                        ExisteUsuario = true;

                    }

                }

                if (!ExisteUsuario) throw new Exception("No autorizado");

                #endregion

            }

            return Usuario;

        }

        public TokenEstandar RefrescarCookies(string? Sesion)
        {

            TokenEstandar IdSesion = new TokenEstandar();

            using (var Conexion = MySQL.ConexionMySQL("direcciontransitousers"))
            {

                #region Verificar si existe la sesion válida por hora

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                Peticion.CommandText = @$"SELECT IdUsuario
            
                    FROM direcciontransitousers.usuarios 
                    
                    WHERE IdSesion = '{Sesion}'

                    AND Activado = TRUE

                    AND IdSesionExpiracion > NOW();";

                Peticion.ExecuteNonQuery();

                bool ExisteSesion = false;

                int IdUsuario = 0;

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        IdUsuario = Reader.GetInt32(0);

                        ExisteSesion = true;

                    }

                }

                if(!ExisteSesion) throw new ExcepcionCustomizada("No autorizado");

                #endregion

                #region Generar Id de sesion (Cookie + DB)

                string Token = string.Empty;

                string Expiracion = string.Empty;

                bool ExisteIdSesion = false;

                while (!ExisteIdSesion)
                {

                    IdSesion = GenerarTokenEstandar(82);

                    Token = IdSesion.Token;

                    Expiracion = IdSesion.Expiracion.ToString("yyyy-MM-dd H:mm:ss");

                    Peticion.CommandText = @$"SELECT IdSesion FROM direcciontransitousers.usuarios
                    
                        WHERE IdSesion = '{Token}';";

                    Peticion.ExecuteNonQuery();

                    using (MySqlDataReader Reader = Peticion.ExecuteReader())
                    {

                        while (Reader.Read())
                        {

                            ExisteIdSesion = true;

                        }

                    }

                    Peticion.CommandText = @$"UPDATE direcciontransitousers.usuarios

                        SET IdSesion = '{Token}',

                            IdSesionExpiracion = '{Expiracion}'

                        WHERE IdSesion = '{Sesion}'

                        AND Activado = TRUE;"; 

                    Peticion.ExecuteNonQuery();

                    if (!ExisteIdSesion) break;

                }

                #endregion

            }

            return IdSesion;

        }

        public bool ValidarSesion(string? Sesion)
        {

            bool SesionValida = false;

            using (var Conexion = MySQL.ConexionMySQL("direcciontransitousers"))
            {

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                Peticion.CommandText = @$"SELECT IdUsuario
            
                    FROM direcciontransitousers.usuarios 
                    
                    WHERE IdSesion = '{Sesion}'

                    AND Activado = TRUE

                    AND IdSesionExpiracion > NOW();";

                Peticion.ExecuteNonQuery();

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        SesionValida = true;

                    }

                }

            }

            return SesionValida;

        }

        public void SolicitarCambioContraseña(string Correo)
        {

            using (var Conexion = MySQL.ConexionMySQL("direcciontransitousers"))
            {

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                #region Filtrar usuario por correo

                Peticion.CommandText = @$"SELECT IdUsuario

                    FROM direcciontransitousers.usuarios 

                    WHERE Correo = '{Correo}'

                    AND Activado = TRUE;";

                Peticion.ExecuteNonQuery();

                int IdSolicitado = 0;

                bool ExisteUsuario = false;

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        IdSolicitado = Reader.GetInt32(0);

                        ExisteUsuario = true;

                    }

                }

                if (!ExisteUsuario) throw new ExcepcionCustomizada("El correo no pudo ser enviado");

                #endregion

                #region Generar token de cambio de contraseña (102B)

                TokenEstandar TokenCambioContraseña = new TokenEstandar();

                string Token = string.Empty;

                string Expiracion = string.Empty;

                bool ExisteToken = false;

                while (!ExisteToken)
                {

                    TokenCambioContraseña = GenerarTokenEstandar(102);

                    Token = TokenCambioContraseña.Token;

                    Expiracion = TokenCambioContraseña.Expiracion.ToString("yyyy-MM-dd H:mm:ss");

                    Peticion.CommandText = @$"SELECT TokenCambioContraseña FROM direcciontransitousers.usuarios
                    
                    WHERE TokenCambioContraseña = '{TokenCambioContraseña}';";

                    Peticion.ExecuteNonQuery();

                    using (MySqlDataReader Reader = Peticion.ExecuteReader())
                    {

                        while (Reader.Read())
                        {

                            ExisteToken = true;

                        }

                    }

                    if (!ExisteToken) break;

                }


                Peticion.CommandText = @$"UPDATE direcciontransitousers.usuarios

                    SET TokenCambioContraseña = '{Token}',

	                    TokenCambioContraseñaExpiracion = '{Expiracion}'

                    WHERE IdUsuario = {IdSolicitado};";

                Peticion.ExecuteNonQuery();

                #endregion

                #region Enviar correo de cambio de contraseña

                string UrlDeActivacion = $"http://localhost:3000/CambiarContrasena/{Token}";

                SmtpClient Cliente = new SmtpClient("smtp-mail.outlook.com");

                Cliente.Port = 587;

                Cliente.DeliveryMethod = SmtpDeliveryMethod.Network;

                Cliente.UseDefaultCredentials = false;

                System.Net.NetworkCredential Credenciales = new System.Net.NetworkCredential("lucassalazarc@outlook.com", "Dragonazul020201");

                Cliente.EnableSsl = true;

                Cliente.Credentials = Credenciales;

                MailMessage CorreoDeActivacion = new MailMessage("lucassalazarc@outlook.com", Correo);

                CorreoDeActivacion.Subject = "Has solicitado un cambio de contraseña | Dirección del tránsito";

                CorreoDeActivacion.Body = @$"

                <h1> Cambio de contraseña </h1 >

                <p> Por favor ingresa a este link para cambiar tu contraseña </p>

                <a href={UrlDeActivacion} clicktracking=off> Cambiar contraseña </a> ";

                CorreoDeActivacion.IsBodyHtml = true;

                Cliente.Send(CorreoDeActivacion);

                #endregion

            }

        }

        public void CambiarContraseña(string TokenDeCambioDeContraseña, string NuevaContraseña, string Correo)
        {

            using (var Conexion = MySQL.ConexionMySQL("direcciontransitousers"))
            {

                var Peticion = new MySqlCommand();

                #region Filtrar usuario por correo y token de cambio de contraseña

                Peticion.Connection = Conexion;

                Peticion.CommandText = @$"SELECT IdUsuario FROM direcciontransitousers.usuarios

                    WHERE TokenCambioContraseñaExpiracion > NOW()

                    AND TokenCambioContraseña = '{TokenDeCambioDeContraseña}'

                    AND Correo = '{Correo}'

                    AND Activado = TRUE;";

                Peticion.ExecuteNonQuery();

                int IdSolicitado = 0;

                bool ExisteUsuario = false;

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        IdSolicitado = Reader.GetInt32(0);

                        ExisteUsuario = true;

                    }

                }

                if (!ExisteUsuario) throw new ExcepcionCustomizada("Ocurrió un error al generar el cambio de contraseña");

                #endregion

                #region Actualizar nueva contraseña

                string NuevaContraseñaEncriptada = EncriptarContraseña(NuevaContraseña);

                Peticion.CommandText = @$"UPDATE direcciontransitousers.usuarios

                    SET TokenCambioContraseña = NULL,

	                    TokenCambioContraseñaExpiracion = NULL,
    
                        Contraseña = '{NuevaContraseñaEncriptada}';";

                Peticion.ExecuteNonQuery();

                #endregion

            }

        }

        #region Helpers

        private string GenerarHashAleatorio(int LargoBytes)
        {

            Random Random = new Random();

            Byte[] Bytes = new Byte[LargoBytes];

            Random.NextBytes(Bytes);

            using (var Algoritmo = SHA512.Create())
            {

                string Hex = "";

                var Hash = Algoritmo.ComputeHash(Bytes);

                Hex = Convert.ToHexString(Hash).ToLower();

                return Hex;

            }

        }

        private string EncriptarContraseña(string Contraseña)
        {

            string SaltJSON = Configuration.GetValue<string>("Salt");

            // Transformar en bytes.
            byte[] BytesSalt = System.Text.UnicodeEncoding.Unicode.GetBytes(SaltJSON);

            byte[] BytesContraseña = System.Text.UnicodeEncoding.Unicode.GetBytes(Contraseña);

            // Genero un nuevo arreglo de bytes, del tamaño de los dos arreglos de bytes sumados.
            byte[] ContraseñaSalteada = new byte[BytesContraseña.Length + BytesSalt.Length];

            // Buffer de origen - Desplazamiento de bytes hacia buffer de origen - Buffer de destino - Desplazamiento de bytes hacia buffer de destino - Número de bytes que se copian.

            // Se ubican los bytes de BytesContraseña en ContraseñaMasSalt.
            System.Buffer.BlockCopy(BytesContraseña, 0, ContraseñaSalteada, 0, BytesContraseña.Length);

            // Se ubican los bytes de BytesSalt a la derecha de BytesContraseña en ContraseñaMasSalt.
            System.Buffer.BlockCopy(BytesSalt, 0, ContraseñaSalteada, BytesContraseña.Length, BytesSalt.Length);

            using (var Algoritmo = SHA512.Create())
            {

                // Genero un hash de la contraseña más el salt.
                byte[] Hash = Algoritmo.ComputeHash(ContraseñaSalteada);

                // Genero un nuevo arreglo de bytes, del tamaño del hash más el salt.
                byte[] HashSalteado = new byte[Hash.Length + BytesSalt.Length];

                // Al hash salteado, le pongo más salt.
                System.Buffer.BlockCopy(Hash, 0, HashSalteado, 0, Hash.Length);

                System.Buffer.BlockCopy(BytesSalt, 0, HashSalteado, Hash.Length, BytesSalt.Length);

                string HashSalteadoString = System.Convert.ToBase64String(HashSalteado);

                int a = HashSalteadoString.Length;

                return HashSalteadoString;

            }

        }

        private TokenEstandar GenerarTokenEstandar(int LargoBytes)
        {

            TokenEstandar TokenRefrescable = new TokenEstandar();

            TokenRefrescable.Token = GenerarHashAleatorio(LargoBytes);

            TokenRefrescable.Expiracion = DateTime.Now.AddMinutes(120);

            TokenRefrescable.Creacion = DateTime.Now;

            return TokenRefrescable;

        }

        private TokenEstandar GenerarTokenEncriptado (string SitioSharepoint)
        {

            TokenEstandar TokenRefrescable = new TokenEstandar();

            TokenRefrescable.Token = EncriptarSitioSPO(SitioSharepoint);

            TokenRefrescable.Expiracion = DateTime.Now.AddMinutes(120);

            TokenRefrescable.Creacion = DateTime.Now;

            return TokenRefrescable;

        }
        
        private string EncriptarSitioSPO (string SitioSharepoint)
        {

            string KeySPO = Configuration.GetValue<string>("KeySPO");

            // Getting the bytes of Input String.
            byte[] toEncryptedArray = UTF8Encoding.UTF8.GetBytes(SitioSharepoint);

            MD5CryptoServiceProvider objMD5CryptoService = new MD5CryptoServiceProvider();

            //Gettting the bytes from the Security Key and Passing it to compute the Corresponding Hash Value.
            byte[] securityKeyArray = objMD5CryptoService.ComputeHash(UTF8Encoding.UTF8.GetBytes(KeySPO));

            //De-allocatinng the memory after doing the Job.
            objMD5CryptoService.Clear();

            var objTripleDESCryptoService = new TripleDESCryptoServiceProvider();

            //Assigning the Security key to the TripleDES Service Provider.
            objTripleDESCryptoService.Key = securityKeyArray;

            //Mode of the Crypto service is Electronic Code Book.
            objTripleDESCryptoService.Mode = CipherMode.ECB;

            //Padding Mode is PKCS7 if there is any extra byte is added.
            objTripleDESCryptoService.Padding = PaddingMode.PKCS7;


            var objCrytpoTransform = objTripleDESCryptoService.CreateEncryptor();

            //Transform the bytes array to resultArray
            byte[] resultArray = objCrytpoTransform.TransformFinalBlock(toEncryptedArray, 0, toEncryptedArray.Length);

            objTripleDESCryptoService.Clear();

            return Convert.ToBase64String(resultArray, 0, resultArray.Length);

        }
        #endregion

    }

}
