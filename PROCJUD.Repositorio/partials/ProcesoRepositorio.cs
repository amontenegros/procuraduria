using PROCJUD.Contexto;
using PROCJUD.Entidades;
using PROCJUD.IRepositorio;
using PROCJUD.Repositorio.Base;
using PROCJUD.Request;
using PROCJUD.Response;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Repositorio
{
    public partial class ProcesoRepositorio : BaseRepositorio<PROCESO>, IProcesoRepositorio
    {
        public List<VW_PROCESO> PaginaProc(int page, int pageSize, ProcesoFilters filters)
        {
            DB_PROCURADURIAEntities dataContext = base.Context.GetContext() as DB_PROCURADURIAEntities;
            var items = dataContext.sp_listar_pagina_proceso(page, pageSize, filters.numero, filters.id_abogado, filters.id_materia, filters.id_naturaleza, filters.id_tipo_proceso, filters.id_estado, filters.fecha_inicio, filters.fecha_fin, filters.razon_social, filters.numero_resolucion, filters.expediente_judicial);
            return items.ToList();
        }

        public int ContarProc(ProcesoFilters filters)
        {
            DB_PROCURADURIAEntities dataContext = base.Context.GetContext() as DB_PROCURADURIAEntities;
            var total = new ObjectParameter("total", 0);
            dataContext.sp_contar_pagina_proceso(filters.numero, filters.id_abogado, filters.id_materia, filters.id_naturaleza, filters.id_tipo_proceso, filters.id_estado, filters.fecha_inicio, filters.fecha_fin, filters.razon_social, filters.numero_resolucion, filters.expediente_judicial, total);
            return Convert.ToInt32(total.Value);
        }

        public PaginationResponse<VwProcesoResponse> PaginaProceso(int page, int pageSize, ProcesoFilters filters)
        {
            DB_PROCURADURIAEntities dataContext = base.Context.GetContext() as DB_PROCURADURIAEntities;

            if (filters.fecha_fin != null) filters.fecha_fin = filters.fecha_fin.Value.AddDays(1);
            Expression<Func<VW_PROCESO, bool>> _where = x =>
             (string.IsNullOrEmpty(filters.numero) || x.numero.Contains(filters.numero))
             && (filters.id_abogado == null || x.ID_ABOGADO == filters.id_abogado)
             && (filters.id_materia == null || x.id_materia == filters.id_materia)
             && (filters.id_naturaleza == null || x.id_naturaleza == filters.id_naturaleza)
             && (filters.id_tipo_proceso == null || x.id_tipo_proceso == filters.id_tipo_proceso)
             && (filters.id_estado == null || x.ESTADO_PROCESO == (filters.id_estado == 0 ? null : filters.id_estado))
             && (filters.fecha_inicio == null || x.auditmod >= filters.fecha_inicio)
             && (filters.fecha_fin == null || x.auditmod <= filters.fecha_fin)
             && (string.IsNullOrEmpty(filters.razon_social) || dataContext.RZ_procuraduria.Count(rz => rz.id_proceso == x.id && dataContext.VW_PERSONA.Where(per => per.NOMBRE.Contains(filters.razon_social)).Any(m => m.ID == rz.id_persona)) > 0)
             && (string.IsNullOrEmpty(filters.numero_resolucion) || dataContext.RESOLIMPUGNADAXPROCESO.Any(r => r.ID_PROCESO == x.id && dataContext.VW_RESOLUCION_SITRADOC.Where(re => re.nro_resol.Contains(filters.numero_resolucion)).Any(m => m.id == r.ID_RESOLUCION)));


            var items = dataContext.VW_PROCESO.Where(_where)
                .OrderByDescending(x => x.auditmod).Skip((page - 1) * pageSize).Take(pageSize)
                .Select(x => new VwProcesoResponse
                {
                    id = x.id,
                    numero = x.numero,
                    materia_descripcion = x.materia_descripcion,
                    naturaleza_descripcion = x.naturaleza_descripcion,
                    tipo_proceso_descripcion = x.tipo_proceso_descripcion,
                    abogado = x.abogado,
                    estado_descripcion = x.estado_descripcion,
                    estado_proceso = x.ESTADO_PROCESO,
                    id_abogado = x.ID_ABOGADO,
                    auditmod = x.auditmod,
                    id_materia = x.id_materia,
                    id_naturaleza = x.id_naturaleza,
                    id_tipo_proceso = x.id_tipo_proceso
                }).ToList();
            var total = dataContext.VW_PROCESO.Count(_where);


            return new PaginationResponse<VwProcesoResponse>
            {
                items = items,
                total = total,
                page = page,
                pageSize = pageSize
            };
        }


        public string Get_correlativo(int id_materia)
        {
            DB_PROCURADURIAEntities dataContext = base.Context.GetContext() as DB_PROCURADURIAEntities;
            var correlativo = new ObjectParameter("correlativo", String.Empty);
            dataContext.sp_get_correlativo(id_materia, correlativo);
            return correlativo.Value.ToString();
        }

        public int? Get_id_resolucion_consav(int id_resolucion_sitradoc)
        {
            DB_PROCURADURIAEntities dataContext = base.Context.GetContext() as DB_PROCURADURIAEntities;
            var id_resolucion_consav = new ObjectParameter("id_resolucion_directoral", 0);
            dataContext.sp_get_id_resolucion_consav(id_resolucion_sitradoc, id_resolucion_consav);
            var id = Convert.ToInt32(id_resolucion_consav.Value);
            if (id == 0) return null;
            return id;
        }
    }
}
