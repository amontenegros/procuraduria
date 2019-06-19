using Autofac;
using Autofac.Integration.Wcf;
using PROCJUD.Host.Modules;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace PROCJUD.Host.Config
{
    public class DependencyInjectionConfig
    {
        public static void LoadContainer()
        {
            var builder = new ContainerBuilder();
            //builder.RegisterModule<ServiciosDominioModule>();
            builder.RegisterModule<RepositorioModule>();
            builder.RegisterModule<AplicacionServiceModule>();
            builder.RegisterInstance(CultureInfo.CurrentCulture).As<IFormatProvider>();
            AutofacHostFactory.Container = builder.Build();
        }
    }
}