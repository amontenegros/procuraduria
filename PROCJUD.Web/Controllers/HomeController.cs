using Seguridad.PRODUCE;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PROCJUD.Web.Controllers
{
    public class HomeController : Controller
    {
        [Authorize]
        [Autorizacion]
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        [Autorizacion]
        public ActionResult LogOut()
        {
            return Redirect(ConfigurationSecurity.LogOut(this));
        }

        [Authorize]
        [Autorizacion]
        [HttpPost]
        public ActionResult UserInfo(UserInformation user)
        {
            return Json(new
            {
                user = new
                {
                    user.CorreoElectronico,
                    user.NombreParaMostrar,
                    user.NombreCompleto,
                    user.Nombres,
                    user.MiAplicacion
                }
            });
        }

        [HttpGet]
        public ActionResult AccesoDenegado()
        {
            return Content("Acceso Denegado");
        }
    }
}