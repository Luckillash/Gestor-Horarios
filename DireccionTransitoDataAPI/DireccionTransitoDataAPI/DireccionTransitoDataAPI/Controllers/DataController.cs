using DireccionTransitoDataAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;
using PnP.Core;
using DireccionTransitoDataAPI.Entities;
using Microsoft.AspNetCore.Authorization;
using DireccionTransitoDataAPI.Services;

namespace DireccionTransitoDataAPI.Controllers
{

    [Route("/DireccionTransitoDataAPI/"), ApiController]
    public class DataController : ControllerBase
    {

        private readonly IDataService DataService;

        public DataController(IDataService dataService)
        {

            DataService = dataService;

        }

        [HttpGet, Route("Etapas"), Authorize]
        public async Task<IActionResult> ObtenerEtapas()
        {

            string? SitioSharepointEncriptado = Request.Cookies["SPO"];

            if (SitioSharepointEncriptado == null) throw new Exception("No autorizado");

            try
            {

                List<Dictionary<string, object>> Etapas = await DataService.ObtenerEtapas(SitioSharepointEncriptado);

                return Ok(Etapas);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpGet, Route("Licencias"), Authorize]
        public async Task<IActionResult> ObtenerLicencias()
        {

            string? SitioSharepointEncriptado = Request.Cookies["SPO"];

            if (SitioSharepointEncriptado == null) throw new Exception("No autorizado");

            try
            {

                List<Dictionary<string, object>> Licencias = await DataService.ObtenerLicencias(SitioSharepointEncriptado);

                return Ok(Licencias);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpPost, Route("Solicitudes"), Authorize]
        public async Task<IActionResult> ObtenerSolicitudes([FromBody] IdUsuario IdUsuario)
        {

            int Id = IdUsuario.Id;

            string? SitioSharepointEncriptado = Request.Cookies["SPO"];

            if (SitioSharepointEncriptado == null) throw new Exception("No autorizado");

            try
            {

                List<Dictionary<string, object>> Solicitudes = await DataService.ObtenerSolicitudes(SitioSharepointEncriptado, Id);

                return Ok(Solicitudes);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpPost, Route("Solicitud"), Authorize]
        public async Task<IActionResult> ObtenerSolicitud([FromBody] IdSolicitud IdSolicitud)
        {

            int Id = IdSolicitud.Id;

            string? SitioSharepointEncriptado = Request.Cookies["SPO"];

            if (SitioSharepointEncriptado == null) throw new Exception("No autorizado");

            try
            {

                Dictionary<string, object> Solicitud = await DataService.ObtenerSolicitud(SitioSharepointEncriptado, Id);

                return Ok(Solicitud);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpPost, Route("Examenes"), Authorize]
        public async Task<IActionResult> ObtenerExamenes([FromBody] Examen Examen)
        {

            int IdSolicitud = Examen.IdSolicitud;

            string TipoExamen = Examen.TipoExamen;

            string? SitioSharepointEncriptado = Request.Cookies["SPO"];

            if (SitioSharepointEncriptado == null) throw new Exception("No autorizado");

            try
            {

                List<Dictionary<string, object>> Examenes = await DataService.ObtenerExamenes(SitioSharepointEncriptado, IdSolicitud, TipoExamen);

                return Ok(Examenes);


            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpPost, Route("Horarios"), Authorize]
        public async Task<IActionResult> ObtenerHorarios()
        {

            string? SitioSharepointEncriptado = Request.Cookies["SPO"];

            if (SitioSharepointEncriptado == null) throw new Exception("No autorizado");

            try
            {

                List<Dictionary<string, object>> Horarios = await DataService.ObtenerHorarios(SitioSharepointEncriptado);

                return Ok(Horarios);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpPost, Route("HorariosOcupados"), Authorize]
        public async Task<IActionResult> ObtenerHorariosOcupados([FromBody] Horario Horario)
        {

            DateTime Fecha = Horario.Fecha;

            string Lista = Horario.Lista;

            string? SitioSharepointEncriptado = Request.Cookies["SPO"];

            if (SitioSharepointEncriptado == null) throw new Exception("No autorizado");

            try
            {

                List<Dictionary<string, object>> Horarios = await DataService.ObtenerHorariosOcupados(SitioSharepointEncriptado, Fecha, Lista);

                return Ok(Horarios);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

    }

}