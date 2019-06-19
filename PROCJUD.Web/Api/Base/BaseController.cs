using PROCJUD.IAplicacionService.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.Web;
using System.Web.Mvc;

namespace PROCJUD.Web.Api.Base
{

    public class BaseController : Controller
    {

        public ActionResult JsonResponse(bool success, int statuscode, string msg = null, Object data = null, string internalmsg = "", Object errors = null)
        {
            var response = new
            {
                success,
                statuscode,
                msg,
                data,
                internalmsg,
                errors
            };

            return Json(response, JsonRequestBehavior.AllowGet);

        }
        // GET: Base
        public ActionResult TryCatch(Func<ActionResult> action)
        {
            try
            {
                return action();
            }
            catch (HttpException e)
            {
                Response.StatusCode = 400;
                return this.JsonResponse(false, 400, "", null, e.Message, "Ocurrió un error interno");
            }
            catch (FaultException<ErrorDetail> e)
            {
                Response.StatusCode = e.Detail.statusCode;
                return this.JsonResponse(false, e.Detail.statusCode, e.Detail.message, null, e.Detail.internalMessage, e.Detail.errors);
            }
            catch (FaultException e)
            {
                Response.StatusCode = 400;
                return this.JsonResponse(false, 400, "", null, e.Message, "Ocurrió un error interno");
            }
            catch (Exception e)
            {
                Response.StatusCode = 500;
                return this.JsonResponse(false, 500, e.Message, null, e.Message);
            }
        }

        protected string ValidateFile(int size, string extension)
        {
            string msg = String.Empty;
            string[] extensiones = { ".pdf" };

            if (size >= (20 * 1024 * 1024))
            {
                msg = "El archivo debe tener como máximo 20MB en tamaño.";
            }
            else if (!extensiones.Contains(extension))
            {
                //msg = "Sólo es permitido archivos del tipo .doc, .docx, .pdf, .jpg";
                msg = "Sólo se permiten archivos del tipo .pdf";
            }

            return msg;
        }
        protected string GetFileServer()
        {
            string fileserver = String.Empty;
            bool useFileserver = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["useFileServer"].ToString());
            if (useFileserver)
                fileserver = System.Configuration.ConfigurationManager.AppSettings["fileServer"].ToString();
            else
                fileserver = Server.MapPath("~/Uploads");

            return fileserver;
        }

        protected string RenderViewToString(string viewName, object model)
        {
            this.ViewData.Model = model;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(this.ControllerContext,
                                                                         viewName);
                var viewContext = new ViewContext(this.ControllerContext, viewResult.View,
                                             this.ViewData, this.TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(this.ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }
    }
}