using DireccionTransitoDataAPI.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DireccionTransitoDataAPI.Entities;

namespace DireccionTransitoDataAPI.Controllers
{
    [Route("/DireccionTransitoDataInicialAPI/"), ApiController]
    public class DataInicialController : ControllerBase
    {

        private readonly IDataInicialService DataInicialService;

        public DataInicialController(IDataInicialService dataInicialService)
        {

            DataInicialService = dataInicialService;

        }

        #region MySQL

        [HttpGet, Route("Regiones")]
        public IActionResult ObtenerRegiones()
        {

            try
            {

                List<string> Regiones = DataInicialService.ObtenerRegiones();

                return Ok(Regiones);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        [HttpGet, Route("Comunas")]
        public IActionResult ObtenerComunas()
        {

            try
            {

                List<Comunas> Comunas = DataInicialService.ObtenerComunas();

                return Ok(Comunas);

            }

            catch (Exception Excepcion)
            {

                string Error = Excepcion.Message;

                return BadRequest(Error);

            }

        }

        #endregion

    }

}
