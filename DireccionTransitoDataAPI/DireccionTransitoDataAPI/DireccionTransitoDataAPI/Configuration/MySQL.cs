using MySql.Data.MySqlClient;

namespace DireccionTransitoDataAPI.Configuration
{

    public class MySQL: IMySQL
    {

        public MySqlConnection ConexionMySQL()
        {

            string Parametros = @"server=localhost;userid=root;password=Dragonazul020201@;database=direcciontransitousers";

            var Conexion = new MySqlConnection(Parametros);

            Conexion.Open();

            return Conexion;

        }

    }
     
}

public interface IMySQL
{

    MySqlConnection ConexionMySQL();

}
