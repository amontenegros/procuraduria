using PROCJUD.Entidades;
using PROCJUD.IAplicacionService;
using PROCJUD.IRepositorio;
using PROCJUD.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.AplicacionService
{
    public class SitradocService : ISitradocService
    {

        private readonly IVwResolucionSitradocRepositorio vwResolucionSitradocRepositorio;
        private readonly IVwDocumentoSitradocRepositorio vwDocumentoSitradocRepositorio;

        public SitradocService(IVwResolucionSitradocRepositorio vwResolucionSitradocRepositorio, IVwDocumentoSitradocRepositorio vwDocumentoSitradocRepositorio)
        {
            this.vwResolucionSitradocRepositorio = vwResolucionSitradocRepositorio;
            this.vwDocumentoSitradocRepositorio = vwDocumentoSitradocRepositorio;
        }

        public PaginationResponse<VwDocumentoSitradocResponse> Documentos(string numero, int page, int pageSize)
        {
            Expression<Func<VW_DOCUMENTO_SITRADOC, bool>> _where = x => !String.IsNullOrEmpty(x.NUM_TRAM_DOCUMENTARIO) && x.NUM_TRAM_DOCUMENTARIO.Contains(numero);

            var items = this.vwDocumentoSitradocRepositorio.Listar(_where, page, pageSize).Select(x => new VwDocumentoSitradocResponse
            {
                id_documento = x.ID_DOCUMENTO,
                num_tram_documentario = x.NUM_TRAM_DOCUMENTARIO,
                auditmod = x.AUDITMOD,
                id_clase_documento_interno = x.ID_CLASE_DOCUMENTO_INTERNO,
                asunto = x.ASUNTO
            }).ToList();

            var total = this.vwDocumentoSitradocRepositorio.Contar(_where);

            return new PaginationResponse<VwDocumentoSitradocResponse>
            {
                items = items,
                total = total,
                page = page,
                pageSize = pageSize
            };
        }

        public List<VwResolucionSitradocResponse> Resoluciones(string numero, int limit = 5)
        {

            var array_coddeps = new int?[] { 25, 47, 48, 24, 16, 36, 54, 335, 261, 115, 247, 246, 41 };

            return this.vwResolucionSitradocRepositorio.Listar(x => array_coddeps.Contains(x.coddep) &&

            x.nro_resol.Contains(numero), 1, limit).Select(x => new VwResolucionSitradocResponse
            {
                id = x.id,
                nro_resol = x.nro_resol,
                sumilla = x.sumilla,
                auditmod = x.auditmod
            }).ToList();
        }

        public VwResolucionSitradocResponse Resolucion(int id)
        {
            return this.vwResolucionSitradocRepositorio.Listar(x => x.id == id).Select(x => new VwResolucionSitradocResponse
            {
                id = x.id,
                nro_resol = x.nro_resol,
                sumilla = x.sumilla,
                auditmod = x.auditmod
            }).FirstOrDefault();
        }
        public VwDocumentoSitradocResponse Documento(int id)
        {
            return this.vwDocumentoSitradocRepositorio.Listar(x => x.ID_DOCUMENTO == id).Select(x => new VwDocumentoSitradocResponse
            {
                id_documento = x.ID_DOCUMENTO,
                num_tram_documentario = x.NUM_TRAM_DOCUMENTARIO,
                auditmod = x.AUDITMOD,
                id_clase_documento_interno = x.ID_CLASE_DOCUMENTO_INTERNO,
                asunto = x.ASUNTO
            }).FirstOrDefault();
        }
    }
}
