using DireccionTransitoDataAPI.Configuration;
using DireccionTransitoDataAPI.Entities;
using DireccionTransitoDataAPI.Interfaces;
using MySql.Data.MySqlClient;

namespace DireccionTransitoDataAPI.Services
{
    public class DataInicialService: IDataInicialService
    {

        private readonly IMySQL MySQL;

        public DataInicialService(IMySQL mySQL)
        {

            MySQL = mySQL;

        }

        public List<string> ObtenerRegiones()
        {

            List<string> ListaRegiones = new List<string>();

            using (var Conexion = MySQL.ConexionMySQL())
            {

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                Peticion.CommandText = @$"SELECT * FROM direcciontransitoinitialdata.regiones;";

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        string Region = Reader.GetString(0);

                        ListaRegiones.Add(Region);

                    }

                }

            }

            return ListaRegiones;

        }

        public List<Comunas> ObtenerComunas()
        {

            List<Comunas> ListaComunas = new List<Comunas>();

            using (var Conexion = MySQL.ConexionMySQL())
            {

                var Peticion = new MySqlCommand();

                Peticion.Connection = Conexion;

                Peticion.CommandText = @$"SELECT * FROM direcciontransitoinitialdata.comunas;";

                using (MySqlDataReader Reader = Peticion.ExecuteReader())
                {

                    while (Reader.Read())
                    {

                        Comunas Comunas = new Comunas
                        {

                            Comuna = Reader.GetString(0),

                            Region = Reader.GetString(1),

                            //Sharepoint = Reader.GetString(2),

                        };

                        ListaComunas.Add(Comunas);

                    }

                }

            }

            return ListaComunas;

        }

    }

}
