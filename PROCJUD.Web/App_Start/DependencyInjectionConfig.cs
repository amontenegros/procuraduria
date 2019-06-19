using Autofac;
using Autofac.Builder;
using Autofac.Integration.Wcf;
using Autofac.Integration.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;
using System.Web.Mvc;
using System.Reflection;
using PROCJUD.IAplicacionService;

namespace SISRCA.Web.App_Start
{
    public class DependencyInjectionConfig
    {

        public static void Register()
        {
            var builder = new ContainerBuilder();
            string baseUriString = System.Configuration.ConfigurationManager.AppSettings["baseUriService"].ToString();

            var baseUri = new Uri(baseUriString);

            //builder.RegisterServiceProxy<ICertificacionAmbientalService>(baseUri, "CertificacionAmbientalService.svc", "FileStreamConfig");
            builder.RegisterServiceProxy<IEnumerableService>(baseUri, "EnumerableService.svc", "FileStreamConfig");
            builder.RegisterServiceProxy<ISitradocService>(baseUri, "SitradocService.svc", "FileStreamConfig");
            builder.RegisterServiceProxy<IGeneralService>(baseUri, "GeneralService.svc", "FileStreamConfig");
            builder.RegisterServiceProxy<IProcesoService>(baseUri, "ProcesoService.svc", "FileStreamConfig"); 
            builder.RegisterServiceProxy<IDetailProcesoService>(baseUri, "DetailProcesoService.svc", "FileStreamConfig");

            builder.RegisterControllers(Assembly.GetExecutingAssembly());


            var container = builder.Build();
            DependencyResolver.SetResolver(new Autofac.Integration.Mvc.AutofacDependencyResolver(container));
        }

    }

    public static class ContainerBuilderExtensions
    {
        public static IRegistrationBuilder<TChannel, SimpleActivatorData, SingleRegistrationStyle> RegisterServiceProxy<TChannel>(this ContainerBuilder builder, Uri baseUri, string relativeUri, string configurationName)
        {
            builder.Register(c => new ChannelFactory<TChannel>(
                string.IsNullOrEmpty(configurationName) ? new BasicHttpBinding() : new BasicHttpBinding(configurationName),
                new EndpointAddress(new Uri(baseUri, relativeUri)))
            ).SingleInstance();


            return builder.Register(c => c.Resolve<ChannelFactory<TChannel>>().CreateChannel())
                .UseWcfSafeRelease();
                //.InstancePerHttpRequest();
        }
    }
}