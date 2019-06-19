using PROCJUD.IAplicacionService;
using PROCJUD.Web.Api.Base;
using System.Web.Mvc;

namespace PROCJUD.Web.Api
{
    public class SitradocController : BaseController
    {
        private readonly ISitradocService sitradocService;

        public SitradocController(ISitradocService sitradocService)
        {
            this.sitradocService = sitradocService;
        }

        [HttpGet]
        public ActionResult Documentos(string numero, int page = 1, int pageSize = 10)
        {
            return this.TryCatch(() =>
            {
                var pagination = this.sitradocService.Documentos(numero, page, pageSize);
                return this.JsonResponse(true, 200, null, new { pagination });
            });
        }

        [HttpGet]
        public ActionResult Resoluciones(string term)
        {
            return this.TryCatch(() =>
            {
                var resoluciones = this.sitradocService.Resoluciones(term);
                return this.JsonResponse(true, 200, null, new { resoluciones });
            });
        }

    }
}