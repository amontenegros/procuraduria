using PROCJUD.Web.Api.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PROCJUD.Web.Api
{
    //[Authorize]
    //[Autorizacion]
    public class ReniecController : BaseController
    {
        [HttpGet]
        public ActionResult consultaDni(string dni)
        {
            return this.TryCatch(() =>
            {
                using (ServiceReniec.WCFSistemasServiceClient client = new ServiceReniec.WCFSistemasServiceClient())
                {
                    var ws = client.Persona_Natural_Reniec(dni);

                    return this.JsonResponse(true, 200, null, new
                    {
                        id_persona = ws.ID,
                        dni = ws.NRO_DOCPERNATURAL,
                        apellidos = ws.APELLIDOS,
                        nombres = ws.NOMBRES
                    });
                }
            });
        }

    }
}