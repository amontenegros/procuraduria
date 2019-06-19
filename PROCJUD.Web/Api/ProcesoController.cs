using PROCJUD.IAplicacionService;
using PROCJUD.Request;
using PROCJUD.Web.Api.Base;
using Seguridad.PRODUCE;
using System;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace PROCJUD.Web.Api
{
    [Authorize]
    [Autorizacion]
    [RoutePrefix("api/proceso")]
    public class ProcesoController : BaseController
    {
        private readonly IProcesoService procesoService;
        private readonly IDetailProcesoService detailProcesoService;

        public ProcesoController(IProcesoService procesoService, IDetailProcesoService detailProcesoService)
        {
            this.procesoService = procesoService;
            this.detailProcesoService = detailProcesoService;
        }

        [HttpGet]
        [Route("")]
        public ActionResult Page(UserInformation user, int page = 1, int pageSize = 10, string numero = null, int? id_naturaleza = null,
         int? id_tipo_proceso = null, int? id_materia = null, string razon_social = null, int? id_abogado = null, string numero_resolucion = null,
         DateTime? fecha_inicio = null, DateTime? fecha_fin = null, int? id_estado = null, string expediente_judicial = null)
        {
            var filters = new ProcesoFilters
            {
                numero = numero,
                id_naturaleza = id_naturaleza,
                id_tipo_proceso = id_tipo_proceso,
                id_materia = id_materia,
                razon_social = razon_social,
                id_abogado = id_abogado,
                numero_resolucion = numero_resolucion,
                fecha_inicio = fecha_inicio,
                fecha_fin = fecha_fin,
                id_estado = id_estado,
                expediente_judicial = expediente_judicial
            };
            return this.TryCatch(() =>
            {
                var UsuarioEsProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                var pagination = this.procesoService.Page(page, pageSize, filters, user.Id, UsuarioEsProcurador);
                return this.JsonResponse(true, 200, null, new { pagination });
            });
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult Get(int id, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var proceso = this.procesoService.Get(id);
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                proceso._readonly = this.procesoService.IsReadonly(proceso, user.Id, esProcurador);
                return this.JsonResponse(true, 200, null, new { proceso });
            });
        }

        [HttpPost]
        [Route("")]
        public ActionResult Post(ProcesoRequest request, UserInformation user)
        {
            //request.usu_transaccion = user.UserName;
            request.usuario = user.UserName;
            if (request.personas != null) request.personas.ForEach(x => { x.usuario = user.UserName; });
            if (request.plantas != null) request.plantas.ForEach(x => { x.usuario = user.UserName; });
            if (request.embarcaciones != null) request.embarcaciones.ForEach(x => { x.usuario = user.UserName; });
            if (request.resoluciones != null) request.resoluciones.ForEach(x => { x.usuario = user.UserName; });

            return this.TryCatch(() =>
            {
                this.procesoService.Save(request);
                if (request._instancia != null && request._instancia.documentos != null)
                {
                    request._instancia.documentos.ForEach(doc =>
                    {
                        if (!string.IsNullOrEmpty(doc.archivo))
                        {
                            this.MoveFileInstancia(doc.archivo);
                        }
                    });
                }

                return this.JsonResponse(true, 200, "Proceso guardado");
            });
        }

        [HttpPost]
        [Route("{id}/finalizar")]
        public ActionResult Finalizar(int id, FormFinalizacionRequest request, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                if (!user.MiAplicacion.Exists(x => x.NombreRol == "Procurador"))
                {
                    Response.StatusCode = 401;
                    return this.JsonResponse(true, 401, "No está autorizado para realizar esta acción");
                }

                request.usuario = user.UserName;
                this.procesoService.Finalizar(id, request);
                return this.JsonResponse(true, 200, "Proceso Finalizado");
            });
        }
        
        [HttpGet]
        [Route("DelegacionMasivaBuscarLegajos")]
        [AutorizacionRol(Roles = "Administrativo , Procurador")]
        public ActionResult DelegacionMasivaBuscarLegajos(int id_abogado, int anio,UserInformation user)
        {            
            return this.TryCatch(() =>
            {

                if (!user.MiAplicacion.Exists(x => x.NombreRol == "Administrativo" || x.NombreRol == "Procurador"))
                {
                    Response.StatusCode = 401;
                    return this.JsonResponse(true, 401, "No está autorizado para realizar esta acción");
                }

                //request.usuario = user.UserName;
                var legajos = this.procesoService.ListParaReasignar(id_abogado, anio);
                return this.JsonResponse(true, 200, data: legajos);
            });
        }

         [HttpPost]
         [Route("DelegacionMasivaLegajos")]
        [AutorizacionRol(Roles = "Administrativo , Procurador")]
        public ActionResult DelegacionMasivaLegajos(ProcesoDelegacionMasiva request, UserInformation user)
         {
             return this.TryCatch(() =>
              {
                  if (!user.MiAplicacion.Exists(x => x.NombreRol == "Administrativo" || x.NombreRol == "Procurador"))
                  {
                      Response.StatusCode = 401;
                      return this.JsonResponse(true, 401, "No está autorizado para realizar esta acción");
                  }

                  request.usuario = user.UserName;
                  this.procesoService.DelegacionMasivaLegajos(request);
                  return this.JsonResponse(true, 200, "Operación realizada con éxito.");
              });
         }

        [HttpPut]
        [Route("{id}")]
        public ActionResult Put(int id, ProcesoRequest request, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                request.usuario = user.UserName;
                if (request.personas != null) request.personas.ForEach(x => { x.usuario = user.UserName; });
                if (request.plantas != null) request.plantas.ForEach(x => { x.usuario = user.UserName; });
                if (request.embarcaciones != null) request.embarcaciones.ForEach(x => { x.usuario = user.UserName; });
                if (request.resoluciones != null) request.resoluciones.ForEach(x => { x.usuario = user.UserName; });
                this.procesoService.Update(id, request);
                return this.JsonResponse(true, 200, "Proceso actualizado");
            });
        }

        //==============================
        //PERSONAS
        //==============================
        [HttpPost]
        [Route("{id}/persona")]
        public ActionResult SavePersona(int id, RzProcuraduriaRequest persona, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                persona.usuario = user.UserName;
                this.detailProcesoService.SavePersona(persona, id);
                var personas = this.detailProcesoService.ListarPersonas(id);
                return this.JsonResponse(true, 200, "Persona guardada", new { personas });
            });
        }
        [HttpDelete]
        [Route("{id}/persona/{id_rz}")]
        public ActionResult DeletePersona(int id, int id_rz, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                this.detailProcesoService.DeletePersona(id_rz);
                var personas = this.detailProcesoService.ListarPersonas(id);
                return this.JsonResponse(true, 200, "Persona eliminada", new { personas });
            });
        }
        //==============================
        //RESOLUCIONES
        //==============================
        [HttpPost]
        [Route("{id}/resolucion")]
        public ActionResult SaveResolucion(int id, ResolimpugnadaxprocesoRequest resolucion, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                resolucion.usuario = user.UserName;
                this.detailProcesoService.SaveResolucion(resolucion, id);
                var resoluciones = this.detailProcesoService.ListarResoluciones(id);
                return this.JsonResponse(true, 200, "Resolución guardada", new { resoluciones });
            });
        }
        [HttpDelete]
        [Route("{id}/resolucion/{id_resol_impugnada}")]
        public ActionResult DeleteResolucion(int id, int id_resol_impugnada, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                this.detailProcesoService.DeleteResolucion(id_resol_impugnada);
                var resoluciones = this.detailProcesoService.ListarResoluciones(id);
                return this.JsonResponse(true, 200, "Resolución eliminada", new { resoluciones });
            });
        }
        //==============================
        //EMBARCACIONES
        //==============================
        [HttpPost]
        [Route("{id}/embarcacion")]
        public ActionResult SaveEmbarcacion(int id, EmbxprocesoRequest embarcacion, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");

                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                embarcacion.usuario = user.UserName;
                this.detailProcesoService.SaveEmbarcacion(embarcacion, id);
                var embarcaciones = this.detailProcesoService.ListarEmbarcaciones(id);
                return this.JsonResponse(true, 200, "Embarcación guardada", new { embarcaciones });
            });
        }
        [HttpDelete]
        [Route("{id}/embarcacion/{id_embxproceso}")]
        public ActionResult DeleteEmbarcacion(int id, int id_embxproceso, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                this.detailProcesoService.DeleteEmbarcacion(id_embxproceso);
                var embarcaciones = this.detailProcesoService.ListarEmbarcaciones(id);
                return this.JsonResponse(true, 200, "Embarcación eliminada", new { embarcaciones });
            });
        }
        //==============================
        //PLANTAS
        //==============================
        [HttpPost]
        [Route("{id}/planta")]
        public ActionResult SavePlanta(int id, PlantaxprocesoRequest planta, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                planta.usuario = user.UserName;
                this.detailProcesoService.SavePlanta(planta, id);
                var plantas = this.detailProcesoService.ListarPlantas(id);
                return this.JsonResponse(true, 200, "Planta guardada", new { plantas });
            });
        }
        [HttpDelete]
        [Route("{id}/planta/{id_plantaxproceso}")]
        public ActionResult DeletePlanta(int id, int id_plantaxproceso, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                this.detailProcesoService.DeletePlanta(id_plantaxproceso);
                var plantas = this.detailProcesoService.ListarPlantas(id);
                return this.JsonResponse(true, 200, "Planta eliminada", new { plantas });
            });
        }

        //==============================
        //INSTANCIAS
        //==============================

        [HttpGet]
        [Route("{id}/instancia/{id_proceso_instancia}")]
        public ActionResult GetInstancia(int id, int id_proceso_instancia, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var proceso = this.procesoService.GetSimpleProceso(id);
                var instancia = this.detailProcesoService.ListarInstancia(id_proceso_instancia);
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                instancia._readonly = this.detailProcesoService.InstanciaReadOnly(proceso, instancia, user.Id, esProcurador);
                return this.JsonResponse(true, 200, null, new { instancia });
            });
        }

        [HttpPost]
        [Route("{id}/instancia")]
        public ActionResult SaveInstancia(int id, SimpleInstanciaRequest request, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                var proceso = this.procesoService.GetSimpleProceso(id);
                request.id_abogado = proceso.id_abogado;
                this.detailProcesoService.SaveInstancia(request, id);
                var instancias = this.detailProcesoService.ListarInstancias(id);
                return this.JsonResponse(true, 200, "Instancia guardada", new { instancias });
            });
        }

        [HttpPut]
        [Route("{id}/instancia/{id_proceso_instancia}")]
        public ActionResult UpdateInstancia(int id, int id_proceso_instancia, DatProcesoInstanciaRequest request, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                this.detailProcesoService.UpdateInstancia(request, id_proceso_instancia);
                var instancias = this.detailProcesoService.ListarInstancias(id);
                return this.JsonResponse(true, 200, "Instancia actualizada", new { instancias });
            });
        }

        [HttpPost]
        [Route("{id}/instancia/{id_proceso_instancia}/finalizar")]
        public ActionResult FinalizarInstancia(int id, int id_proceso_instancia, FormFinalizacionRequest request, UserInformation user)
        {
            return this.TryCatch(() =>
            {
                var esProcurador = user.MiAplicacion.Exists(x => x.NombreRol == "Procurador");
                this.procesoService.CanUpdateProceso(id, user.Id, esProcurador);
                this.detailProcesoService.FinalizaInstancia(request, id_proceso_instancia);
                var instancias = this.detailProcesoService.ListarInstancias(id);
                return this.JsonResponse(true, 200, "Se finalizó la instancia", new { instancias });
            });
        }

        //==============================
        //INSTANCIA DOCUMENTO
        //==============================        

        [HttpPost]
        [Route("{id_proceso}/instancia/{id_proceso_instancia}/documento")]
        public ActionResult SaveInstanciaDocumento(int id_proceso, int id_proceso_instancia, DatProcesoInstanciaDocumentoRequest request)
        {
            return this.TryCatch(() =>
            {
                this.detailProcesoService.SaveDocumento(request, id_proceso_instancia);
                if (!string.IsNullOrEmpty(request.archivo))
                    this.MoveFileInstancia(request.archivo);
                var instancia = this.detailProcesoService.ListarInstancia(id_proceso_instancia);
                return this.JsonResponse(true, 200, "Documento guardado", new { instancia });
            });
        }

        [HttpDelete]
        [Route("{id_proceso}/instancia/{id_proceso_instancia}/documento/{id_proceso_instancia_documento}")]
        public ActionResult DeleteInstanciaDocumento(int id_proceso, int id_proceso_instancia, int id_proceso_instancia_documento)
        {
            return this.TryCatch(() =>
            {
                //this.procesoService.CanUpdate(id, 1, "");
                //var proceso = this.procesoService.GetSimpleProceso(id);
                //request.id_abogado = proceso.id_abogado;
                this.detailProcesoService.DeleteDocumento(id_proceso_instancia, id_proceso_instancia_documento);
                var instancia = this.detailProcesoService.ListarInstancia(id_proceso_instancia);
                return this.JsonResponse(true, 200, "Documento eliminado", new { instancia });
            });
        }

        //==============================
        //INSTANCIA PLAZO
        //==============================

        [HttpPost]
        [Route("{id_proceso}/instancia/{id_proceso_instancia}/plazo")]
        public ActionResult SaveInstanciaPlazo(int id_proceso, int id_proceso_instancia, DatProcesoPlazoRequest request)
        {
            return this.TryCatch(() =>
            {
                //this.procesoService.CanUpdate(id, 1, "");
                var proceso = this.procesoService.GetSimpleProceso(id_proceso);
                request.id_abogado = proceso.id_abogado;
                this.detailProcesoService.SavePlazo(request, id_proceso_instancia);
                var instancia = this.detailProcesoService.ListarInstancia(id_proceso_instancia);
                return this.JsonResponse(true, 200, "Plazo guardado", new { instancia });
            });
        }

        [HttpPut]
        [Route("{id_proceso}/instancia/{id_proceso_instancia}/plazo/{id_proceso_plazo}")]
        public ActionResult UpdateInstanciaPlazo(int id_proceso, int id_proceso_instancia, int id_proceso_plazo, DatProcesoPlazoRequest request)
        {
            return this.TryCatch(() =>
            {
                //this.procesoService.CanUpdate(id, 1, "");
                this.detailProcesoService.UpdatePlazo(request, id_proceso_plazo);
                var instancia = this.detailProcesoService.ListarInstancia(id_proceso_instancia);
                return this.JsonResponse(true, 200, "Plazo guardado", new { instancia });
            });
        }

        [HttpDelete]
        [Route("{id_proceso}/instancia/{id_proceso_instancia}/plazo/{id_proceso_plazo}")]
        public ActionResult DeleteInstanciaPlazo(int id_proceso, int id_proceso_instancia, int id_proceso_plazo)
        {
            return this.TryCatch(() =>
            {
                //validar
                this.detailProcesoService.DeletePlazo(id_proceso_instancia, id_proceso_plazo);
                var instancia = this.detailProcesoService.ListarInstancia(id_proceso_instancia);
                return this.JsonResponse(true, 200, "Plazo eliminado", new { instancia });
            });
        }

        #region
        private void MoveFileInstancia(string filename)
        {
            string fileserver = this.GetFileServer();

            string OriginPath = String.Format("{0}/{1}", fileserver, "_temp");
            string DestinyPath = String.Format("{0}/{1}", fileserver, "instancia");

            bool folderExists = Directory.Exists(DestinyPath);

            if (!folderExists)
                Directory.CreateDirectory(DestinyPath);

            System.IO.File.Move(OriginPath + "/" + filename, DestinyPath + "/" + filename);
        }
        #endregion

    }
}