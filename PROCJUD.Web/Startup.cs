using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(PROCJUD.Web.Startup))]

namespace PROCJUD.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var startup = new Seguridad.PRODUCE.config.Startup();
            startup.ConfigureAuth(app);
        }
    }
}
