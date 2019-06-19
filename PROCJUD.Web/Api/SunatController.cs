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
    public class SunatController : BaseController
    {
        [HttpGet]
        public ActionResult consultaRuc(string ruc)
        {
            return this.TryCatch(() =>
            {
                using (ServiceSunat.WCFSistemasServiceClient client = new ServiceSunat.WCFSistemasServiceClient())
                {
                    var ws = client.Persona_Juridica_Sunat(ruc);

                    return this.JsonResponse(true, 200, null, new
                    {
                        id_persona = ws.IdPersona,
                        ruc = ws.Ruc,
                        razon_social = ws.RazonSocial,
                        domicilio = (ws.Direccion == null ? null : ws.Direccion.Direc),
                        codigo_departamento = (ws.Direccion == null ? "00" : ws.Direccion.CodDepartamento),
                        codigo_provincia = (ws.Direccion == null ? "00" : ws.Direccion.CodProvincia),
                        codigo_distrito = (ws.Direccion == null ? "00" : ws.Direccion.CodDistrito)
                    });
                }
            });
        }

    }
}