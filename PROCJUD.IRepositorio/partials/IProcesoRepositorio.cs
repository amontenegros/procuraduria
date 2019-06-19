using PROCJUD.Entidades;
using PROCJUD.IRepositorio.Base;
using PROCJUD.Request;
using PROCJUD.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.IRepositorio
{
    public partial interface IProcesoRepositorio : IBaseRepositorio<PROCESO>
    {
        List<VW_PROCESO> PaginaProc(int page, int pageSize, ProcesoFilters filters);

        int ContarProc(ProcesoFilters filters);

        PaginationResponse<VwProcesoResponse> PaginaProceso(int page, int pageSize, ProcesoFilters filters);

        string Get_correlativo(int id_materia);

        int? Get_id_resolucion_consav(int id_resolucion_sitradoc);
    }
}
