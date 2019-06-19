using PROCJUD.IAplicacionService;
using PROCJUD.Web.Api.Base;
using Seguridad.PRODUCE;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace PROCJUD.Web.Api
{
    [Authorize]
    [Autorizacion]
    [RoutePrefix("api/file")]
    public class FileController : BaseController
    {
        private readonly IDetailProcesoService detailProcesoService;
        public FileController(IDetailProcesoService detailProcesoService)
        {
            this.detailProcesoService = detailProcesoService;
        }

        [HttpPost]
        public ActionResult Upload(HttpPostedFileBase file)
        {

            string fileserver = this.GetFileServer();

            string path = String.Format("{0}/{1}", fileserver, "_temp");
            string new_filename = String.Empty;
            return this.TryCatch(() =>
            {
                bool folderExists = Directory.Exists(path);
                if (!folderExists)
                    Directory.CreateDirectory(path);

                var size = file.ContentLength;
                var extension = Path.GetExtension(file.FileName);
                var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                fileName = string.Concat(fileName.Split(' '));
                fileName = Regex.Replace(fileName, "[^a-zA-Z0-9% ._]", string.Empty).ToLower();

                string errors = this.ValidateFile(size, extension);

                if (!String.IsNullOrEmpty(errors))
                {
                    Response.StatusCode = 400;
                    return this.JsonResponse(true, 400, errors);
                }

                new_filename = string.Format("{0}_{1}{2}", Path.GetRandomFileName(), fileName, extension);

                //new_filename = Path.ChangeExtension(new_filename, extension);                

                file.SaveAs(Path.Combine(path, new_filename));

                return this.JsonResponse(true, 200, "Archivo subido", new { filename = new_filename });
            });
        }

        [HttpGet]
        [Route("documento_instancia/{id_proceso_instancia_documento}")]
        public ActionResult GetInstanciaDocumentoFile(int id_proceso_instancia_documento)
        {
            return this.TryCatch(() =>
            {
                var documento = this.detailProcesoService.ListarInstanciaDocumento(id_proceso_instancia_documento);
                string fileserver = this.GetFileServer();
                string filepath = String.Format("{0}/{1}/{2}", fileserver, "instancia", documento.archivo);
                byte[] filedata = System.IO.File.ReadAllBytes(filepath);
                string contentType = MimeMapping.GetMimeMapping(filepath);

                var cd = new System.Net.Mime.ContentDisposition
                {
                    FileName = documento.archivo,
                    Inline = true,
                };

                Response.AppendHeader("Content-Disposition", cd.ToString());
                return File(filedata, contentType);
            });
        }

    }
}