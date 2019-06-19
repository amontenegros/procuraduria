using PROCJUD.IAplicacionService;
using PROCJUD.Web.Api.Base;
using System.Web.Mvc;

namespace PROCJUD.Web.Api
{
    public class GeneralController : BaseController
    {
        private readonly IGeneralService generalService;

        public GeneralController(IGeneralService generalService)
        {
            this.generalService = generalService;
        }


        [HttpGet]
        public ActionResult BuscarEmbarcacion(string term)
        {
            return this.TryCatch(() =>
            {
                var embarcaciones = this.generalService.BuscarEmbarcacion(term);
                return this.JsonResponse(true, 200, null, new { embarcaciones });
            });
        }

        [HttpGet]
        public ActionResult BuscarPlanta(string term)
        {
            return this.TryCatch(() =>
            {
                var plantas = this.generalService.BuscarPlanta(term);
                return this.JsonResponse(true, 200, null, new { plantas });
            });
        }

        [HttpGet]
        public ActionResult BuscarPersona(string term)
        {
            return this.TryCatch(() =>
            {
                var personas = this.generalService.BuscarPersona(term, 50);
                return this.JsonResponse(true, 200, null, new { personas });
            });
        }

    }
}