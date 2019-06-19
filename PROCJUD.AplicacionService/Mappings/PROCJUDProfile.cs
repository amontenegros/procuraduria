using AutoMapper;
using PROCJUD.Entidades;
using PROCJUD.Request;
using PROCJUD.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.AplicacionService.Mappings
{
    public class PROCJUDProfile : Profile
    {
        public PROCJUDProfile()
        {
            /*CreateMap<CertificacionAmbientalRequest, DAT_CERTIFICACION_AMBIENTAL>()
                .ForMember(e => e.direccion, option => option.MapFrom(req => (string.IsNullOrEmpty(req.direccion) ? null : req.direccion.Trim().ToUpper())));*/

            //============================
            // REQUEST A ENTIDADES
            //============================

            CreateMap<ProcesoRequest, PROCESO>();

            CreateMap<RzProcuraduriaRequest, RZ_procuraduria>();

            CreateMap<ResolimpugnadaxprocesoRequest, RESOLIMPUGNADAXPROCESO>();

            CreateMap<EmbxprocesoRequest, EMBXPROCESO>();

            CreateMap<PlantaxprocesoRequest, PLANTAXPROCESO>();

            CreateMap<DatProcesoInstanciaDocumentoRequest, DAT_PROCESO_INSTANCIA_DOCUMENTO>();

            CreateMap<DatProcesoInstanciaRequest, DAT_PROCESO_INSTANCIA>();

            CreateMap<DatProcesoPlazoRequest, DAT_PROCESO_PLAZO>();
            //============================
            // ENTIDADES A RESPONSE
            //============================

            CreateMap<TIPO_MONTO, TipoMontoResponse>();

            CreateMap<TIPO_INSTANCIA, TipoInstanciaResponse>();

            CreateMap<TIPO_PLAZO, TipoPlazoResponse>();

            CreateMap<DAT_PROCESO_PLAZO, DatProcesoPlazoResponse>()
                .ForMember(resp => resp._plazo, option => option.MapFrom(e => e.TIPO_PLAZO));

            CreateMap<DAT_PROCESO_INSTANCIA_DOCUMENTO, DatProcesoInstanciaDocumentoResponse>();

            CreateMap<PROCESO, ProcesoResponse>()
                .ForMember(resp => resp.proceso_instancia, option => option.Ignore());

            CreateMap<DAT_PROCESO_INSTANCIA, DatProcesoInstanciaResponse>()
                .ForMember(resp => resp.eso, option => option.Ignore())
                .ForMember(resp => resp._instancia, option => option.MapFrom(e => e.TIPO_INSTANCIA))
                .ForMember(resp => resp.proceso_instancia_documento, option => option.MapFrom(e => e.DAT_PROCESO_INSTANCIA_DOCUMENTO))
                .ForMember(resp => resp._monto, option => option.MapFrom(e => e.TIPO_MONTO))
                .ForMember(resp => resp.proceso_plazo, option => option.MapFrom(e => e.DAT_PROCESO_PLAZO));

            CreateMap<VW_PROCESO, VwProcesoResponse>();

            CreateMap<RZ_procuraduria, RzProcuraduriaResponse>();
        }
    }
}
