using PROCJUD.IAplicacionService.Helpers;
using PROCJUD.Request;
using PROCJUD.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.IAplicacionService
{
    [ServiceContract]
    public interface IProcesoService
    {
        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        PaginationResponse<VwProcesoResponse> Page(int page, int pageSize, ProcesoFilters filters, int codigo_trabajador, bool usuarioEsProcurador);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void Save(ProcesoRequest request);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void Finalizar(int id, FormFinalizacionRequest request);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        IList<VwProcesoResponse> ListParaReasignar(int id_abogado, int anio);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void DelegacionMasivaLegajos(ProcesoDelegacionMasiva request);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void Update(int id, ProcesoRequest request);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        ProcesoResponse Get(int id);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void CanUpdateProceso(int id, int id_abogado, bool usuarioEsProcurador);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        ProcesoResponse GetSimpleProceso(int id);

        [OperationContract]
        bool IsReadonly(ProcesoResponse proceso, int codigo_trabajador, bool usuarioEsProcurador);
    }
}
