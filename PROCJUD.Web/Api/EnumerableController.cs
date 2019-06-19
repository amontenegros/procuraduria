using PROCJUD.IAplicacionService;
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
    public class EnumerableController : BaseController
    {
        private readonly IEnumerableService enumerableService;

        public EnumerableController(IEnumerableService enumerableService)
        {
            this.enumerableService = enumerableService;
        }

        [HttpGet]
        public ActionResult Materia()
        {
            return this.TryCatch(() =>
            {
                var materias = this.enumerableService.Materia();
                return this.JsonResponse(true, 200, null, new { materias });
            });
        }

        [HttpGet]
        public ActionResult Naturaleza(int id_materia, int all = 0)
        {
            return this.TryCatch(() =>
            {
                var naturalezas = this.enumerableService.Naturaleza(id_materia, all);
                return this.JsonResponse(true, 200, null, new { naturalezas });
            });
        }

        [HttpGet]
        public ActionResult TiposProceso(int id_materia, int all = 0)
        {
            return this.TryCatch(() =>
            {
                var tiposProceso = this.enumerableService.TipoProceso(id_materia, all);
                return this.JsonResponse(true, 200, null, new { tiposProceso });
            });
        }

        [HttpGet]
        public ActionResult Opd()
        {
            return this.TryCatch(() =>
            {
                var opd = this.enumerableService.Opd();
                return this.JsonResponse(true, 200, null, new { opd });
            });
        }

        [HttpGet]
        public ActionResult Condicion()
        {
            return this.TryCatch(() =>
            {
                var condiciones = this.enumerableService.Condicion();
                return this.JsonResponse(true, 200, null, new { condiciones });
            });
        }

        [HttpGet]
        public ActionResult TipoResponsabilidad()
        {
            return this.TryCatch(() =>
            {
                var tipos_responsabilidad = this.enumerableService.TipoResponsabilidad();
                return this.JsonResponse(true, 200, null, new { tipos_responsabilidad });
            });
        }

        [HttpGet]
        public ActionResult EtapaProcesal()
        {
            return this.TryCatch(() =>
            {
                var etapas_procesales = this.enumerableService.EtapaProcesal();
                return this.JsonResponse(true, 200, null, new { etapas_procesales });
            });
        }

        [HttpGet]
        public ActionResult Abogados()
        {
            return this.TryCatch(() =>
            {
                var abogados = this.enumerableService.Abogados();
                return this.JsonResponse(true, 200, null, new { abogados });
            });
        }

        [HttpGet]
        public ActionResult TipoInstancia(int id_tipo_proceso)
        {
            return this.TryCatch(() =>
            {
                var instancias = this.enumerableService.TipoInstancia(id_tipo_proceso);
                return this.JsonResponse(true, 200, null, new { instancias });
            });
        }

        [HttpGet]
        public ActionResult TipoPlazo(int id_tipo_instancia)
        {
            return this.TryCatch(() =>
            {
                var plazos = this.enumerableService.TipoPlazo(id_tipo_instancia);
                return this.JsonResponse(true, 200, null, new { plazos });
            });
        }

        [HttpGet]
        public ActionResult TipoMonto()
        {
            return this.TryCatch(() =>
            {
                var tiposMonto = this.enumerableService.TipoMonto();
                return this.JsonResponse(true, 200, null, new { tiposMonto });
            });
        }

    }
}