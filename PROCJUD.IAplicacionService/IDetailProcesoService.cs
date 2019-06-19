using PROCJUD.Entidades;
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
    public interface IDetailProcesoService
    {
        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        List<RzProcuraduriaResponse> ListarPersonas(int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SavePersonas(List<RZ_procuraduria> personas, int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SavePersona(RzProcuraduriaRequest request, int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void DeletePersona(int id_rz);



        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        List<ResolimpugnadaxprocesoResponse> ListarResoluciones(int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SaveResoluciones(List<RESOLIMPUGNADAXPROCESO> resoluciones, int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SaveResolucion(ResolimpugnadaxprocesoRequest request, int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void DeleteResolucion(int id_resolxproceso);




        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        List<PlantaxprocesoResponse> ListarPlantas(int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SavePlantas(List<PLANTAXPROCESO> plantas, int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SavePlanta(PlantaxprocesoRequest request, int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void DeletePlanta(int id_plantaxproceso);





        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        List<EmbxprocesoResponse> ListarEmbarcaciones(int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SaveEmbarcaciones(List<EMBXPROCESO> embarcaciones, int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SaveEmbarcacion(EmbxprocesoRequest request, int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void DeleteEmbarcacion(int id_embxproceso);

        //============
        //INSTANCIAS
        //============

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        List<DatProcesoInstanciaResponse> ListarInstancias(int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        DatProcesoInstanciaResponse ListarInstancia(int id_proceso_instancia);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SaveInstancia(SimpleInstanciaRequest request, int id_proceso);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void DeleteInstancia(int id_proceso_instancia);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void UpdateInstancia(DatProcesoInstanciaRequest request, int id_proceso_instancia);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void FinalizaInstancia(FormFinalizacionRequest request, int id_proceso_instancia);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        bool InstanciaReadOnly(ProcesoResponse proceso, DatProcesoInstanciaResponse instancia, int codigo_trabajador, bool usuarioEsProcurador);

        //============
        //DOCUMENTOS
        //============
        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        DatProcesoInstanciaDocumentoResponse ListarInstanciaDocumento(int id_proceso_instancia_documento);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SaveDocumento(DatProcesoInstanciaDocumentoRequest request, int id_proceso_instancia);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void DeleteDocumento(int id_proceso_instancia, int id_proceso_instancia_documento);


        //============
        //PLAZOS
        //============
        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void SavePlazo(DatProcesoPlazoRequest request, int id_proceso_instancia);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void UpdatePlazo(DatProcesoPlazoRequest request, int id_proceso_plazo);

        [OperationContract]
        [FaultContract(typeof(ErrorDetail))]
        void DeletePlazo(int id_proceso_instancia, int id_proceso_plazo);

        [OperationContract]
        List<EtapasResponse> GetEtapas(int id_proceso);

        [OperationContract]
        SedeResponse GetSedeJudicial(string codigo_distrito_judicial, string codigo_sede);


        //============
        //VALIDACIONES
        //============
        /**
        [OperationContract]
        void CanCreatePlazo(int id_proceso_instancia, int id_proceso_plazo);

        [OperationContract]
        void CanDeletePlazo(int id_proceso_instancia, int id_proceso_plazo);*/
    }
}
