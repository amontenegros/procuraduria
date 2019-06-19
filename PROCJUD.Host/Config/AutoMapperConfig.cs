using AutoMapper;
using PROCJUD.AplicacionService.Mappings;
//using SISRCA.AplicacionService.Mappings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PROCJUD.Host.Config
{
    public class AutoMapperConfig
    {
        public static void Configure()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile(new PROCJUDProfile());
                //cfg.AddProfile(new RolesProfile());
                //cfg.AddProfile(new ExtranetProfile());
                //cfg.AddProfile(new ExternosProfile());
                //cfg.AddProfile(new IntervencionesProfile());
            });
        }
    }
}