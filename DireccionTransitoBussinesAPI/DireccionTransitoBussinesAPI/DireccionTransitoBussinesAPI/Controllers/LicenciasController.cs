using Microsoft.AspNetCore.Mvc;
using DireccionTransitoBussinesAPI.Interfaces;
using DireccionTransitoBussinesAPI.Services;
using Microsoft.AspNetCore.Authorization;
using PnP.Core;
using DireccionTransitoBussinesAPI.Entities;

namespace DireccionTransitoBussinesAPI.Controllers
{

    [Route("/DireccionTransitoBussinesAPI/"), ApiController]
    public class LicenciasController : ControllerBase
    {

        private readonly ILicenciasService LicenciasService;

        public LicenciasController(ILicenciasService licenciasService)
        {

            LicenciasService = licenciasService;

        }

        [HttpPost, Route("GenerarSolicitud")]
        public async Task<IActionResult> GenerarSolicitud([FromBody] NuevaLicencia NuevaLicencia)
        {

            try
            {

                int IdSolicitud = await LicenciasService.GenerarSolicitud(NuevaLicencia);

                return Ok(IdSolicitud);

            }

            catch (ServiceException ex)
            {

                return BadRequest();

            }

        }

        [HttpPost, Route("GenerarExamen")]
        public async Task<IActionResult> GenerarExamen([FromBody] Examen Examen)
        {

            try
            {

                await LicenciasService.GenerarExamen(Examen);

                return Ok();

            }

            catch (ServiceException ex)
            {

                return BadRequest();

            }

        }

        [HttpPost, Route("AvanzarEtapa")]
        public async Task<IActionResult> AvanzarEtapa([FromBody] Avance Avance)
        {

            try
            {

                await LicenciasService.AvanzarEtapa(Avance);

                return Ok();

            }

            catch (ServiceException ex)
            {

                return BadRequest();

            }

        }
    }

}
