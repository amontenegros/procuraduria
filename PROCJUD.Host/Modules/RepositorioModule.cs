using Autofac;
using PROCJUD.Contexto;
using PROCJUD.IRepositorio.Base;
using PROCJUD.Repositorio.Base;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Web;

namespace PROCJUD.Host.Modules
{
    public class RepositorioModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.Load("PROCJUD.Repositorio"))
                  .Where(t => t.Name.EndsWith("Repositorio"))
                  .AsImplementedInterfaces();

            var method = typeof(RepositorioModule).GetMethod("RegisterRepository");
            var types = Assembly.Load("PROCJUD.Entidades").GetTypes();
            foreach (var type in types) method.MakeGenericMethod(type).Invoke(null, new[] { builder });

            string nameOrConnectionString = "name=DB_PROCURADURIAEntities";
            builder.RegisterType<DB_PROCURADURIAEntities>().As<DbContext>().WithParameter("nameOrConnectionString", nameOrConnectionString).InstancePerLifetimeScope();

            builder.RegisterType<ContextPROCJUD>().As<IContext>();

            builder.RegisterType<ContextPROCJUD>().As<IUnitOfWork>();
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1004:GenericMethodsShouldProvideTypeParameter")]
        public static void RegisterRepository<T>(ContainerBuilder builder) where T : class
        {
            builder.RegisterType<BaseRepositorio<T>>().AsImplementedInterfaces();
        }
    }
}