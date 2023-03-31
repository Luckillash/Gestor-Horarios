using MySql.Data.MySqlClient;

namespace DireccionTransitoUserAPI.Configuration
{

    public class MySQL: IMySQL
    {

        public MySqlConnection ConexionMySQL(string DB)
        {

            string Parametros = $@"server=localhost;userid=root;password=Dragonazul020201@;database={DB}";

            var Conexion = new MySqlConnection(Parametros);

            Conexion.Open();

            return Conexion;

        }

    }
     
}

public interface IMySQL
{

    MySqlConnection ConexionMySQL(string DB);

}
