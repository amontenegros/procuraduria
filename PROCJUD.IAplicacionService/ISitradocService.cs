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
    public interface ISitradocService
    {
        [OperationContract]
        List<VwResolucionSitradocResponse> Resoluciones(string numero, int limit = 5);

        [OperationContract]
        PaginationResponse<VwDocumentoSitradocResponse> Documentos(string numero, int page, int pageSize);

        [OperationContract]
        VwResolucionSitradocResponse Resolucion(int id);

        [OperationContract]
        VwDocumentoSitradocResponse Documento(int id);

    }
}
