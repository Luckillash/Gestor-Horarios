namespace DireccionTransitoUserAPI.Entities
{

    [Serializable]
    public class ExcepcionCustomizada : Exception
    {

        public ExcepcionCustomizada() { }

        public ExcepcionCustomizada(string Mensaje): base(Mensaje) { }

        public ExcepcionCustomizada(string Mensaje, Exception ExcepcionInterna): base(Mensaje, ExcepcionInterna) { }

    }

}
