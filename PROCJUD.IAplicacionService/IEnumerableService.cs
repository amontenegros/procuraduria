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
    public interface IEnumerableService
    {
        [OperationContract]
        List<DesplegableResponse> Opd();

        [OperationContract]
        List<DesplegableResponse> Naturaleza(int id_materia, int all);

        [OperationContract]
        List<DesplegableResponse> Materia();

        [OperationContract]
        List<DesplegableResponse> TipoProceso(int id_materia, int all);

        [OperationContract]
        List<DesplegableResponse> Condicion(int? id = null);

        [OperationContract]
        List<DesplegableResponse> TipoResponsabilidad();

        [OperationContract]
        List<DesplegableResponse> EtapaProcesal();

        [OperationContract]
        List<DesplegableResponse> Abogados();

        [OperationContract]
        List<DesplegableResponse> TipoInstancia(int id_tipo_proceso);

        [OperationContract]
        List<DesplegableResponse> TipoPlazo(int id_tipo_instancia);

        [OperationContract]
        List<DesplegableResponse> TipoMonto();
    }
}
