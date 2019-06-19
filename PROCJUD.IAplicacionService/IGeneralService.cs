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
    public interface IGeneralService
    {

        [OperationContract]
        List<VwEmbarcacionResponse> BuscarEmbarcacion(string nombre, int limit = 5);

        [OperationContract]
        List<VwPlantaPesqueraResponse> BuscarPlanta(string nombre, int limit = 5);

        [OperationContract]
        List<VwPersonaResponse> BuscarPersona(string nombre, int limit = 5);

        [OperationContract]
        VwPersonaResponse GetPersona(int? id);

        [OperationContract]
        VwEmbarcacionResponse GetEmbarcacion(int? id);

        [OperationContract]
        VwPlantaPesqueraResponse GetPlanta(int? id);

        [OperationContract]
        VwTrabajadorProduceResponse GetTrabajador(int id_trabajador);
    }
}
