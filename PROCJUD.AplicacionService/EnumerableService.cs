using PROCJUD.AplicacionService.Base;
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
    public class EnumerableService : BaseService, IEnumerableService
    {
        private readonly IMateriaRepositorio materiaRepositorio;
        private readonly INaturalezaRepositorio naturalezaRepositorio;
        private readonly IOpdRepositorio opdRepositorio;
        private readonly ITipoProcesoRepositorio tipoProcesoRepositorio;
        private readonly ICondicionRepositorio condicionRepositorio;
        private readonly ITipoResponsabilidadRepositorio tipoResponsabilidadRepositorio;
        private readonly IEtapaProcesalRepositorio etapaProcesalRepositorio;
        private readonly IVwTrabajadorProduceRepositorio trabajadorProduceRepositorio;
        private readonly ITipoInstanciaRepositorio tipoInstanciaRepositorio;
        private readonly ITipoPlazoRepositorio tipoPlazoRepositorio;
        private readonly ITipoMontoRepositorio tipoMontoRepositorio;
        private readonly IDatMateriaTipoProcesoRepositorio materiaTipoProcesoRepositorio;

        public EnumerableService(
            IMateriaRepositorio materiaRepositorio,
            INaturalezaRepositorio naturalezaRepositorio,
            IOpdRepositorio opdRepositorio,
            ITipoProcesoRepositorio tipoProcesoRepositorio,
            ICondicionRepositorio condicionRepositorio,
            ITipoResponsabilidadRepositorio tipoResponsabilidadRepositorio,
            IEtapaProcesalRepositorio etapaProcesalRepositorio,
            IVwTrabajadorProduceRepositorio trabajadorProduceRepositorio,
            ITipoInstanciaRepositorio tipoInstanciaRepositorio,
            ITipoPlazoRepositorio tipoPlazoRepositorio,
            ITipoMontoRepositorio tipoMontoRepositorio,
            IDatMateriaTipoProcesoRepositorio materiaTipoProcesoRepositorio)
        {
            this.materiaRepositorio = materiaRepositorio;
            this.naturalezaRepositorio = naturalezaRepositorio;
            this.opdRepositorio = opdRepositorio;
            this.tipoProcesoRepositorio = tipoProcesoRepositorio;
            this.condicionRepositorio = condicionRepositorio;
            this.tipoResponsabilidadRepositorio = tipoResponsabilidadRepositorio;
            this.etapaProcesalRepositorio = etapaProcesalRepositorio;
            this.trabajadorProduceRepositorio = trabajadorProduceRepositorio;
            this.tipoInstanciaRepositorio = tipoInstanciaRepositorio;
            this.tipoPlazoRepositorio = tipoPlazoRepositorio;
            this.tipoMontoRepositorio = tipoMontoRepositorio;
            this.materiaTipoProcesoRepositorio = materiaTipoProcesoRepositorio;
        }

        public List<DesplegableResponse> Materia()
        {
            return materiaRepositorio.Listar().Select(x => new DesplegableResponse
            {
                id = x.id,
                label = x.descripcion
            }).ToList();
        }

        public List<DesplegableResponse> Naturaleza(int id_materia, int all)
        {
            Expression<Func<naturaleza, bool>> filter = x => x.id_materia == id_materia
               && (all == 1 || x.estado == 1);
            return naturalezaRepositorio.Listar(filter).Select(x => new DesplegableResponse
            {
                id = x.id,
                label = x.descripcion
            }).ToList();
        }

        public List<DesplegableResponse> Opd()
        {
            return opdRepositorio.Listar(x => x.estado == true).Select(x => new DesplegableResponse
            {
                id = x.id_opd,
                label = x.descripcion
            }).ToList();
        }

        public List<DesplegableResponse> TipoProceso(int id_materia, int all)
        {
            return (from a in materiaTipoProcesoRepositorio.Listar()
                    join b in tipoProcesoRepositorio.Listar()
                    on a.id_tipo_proceso equals b.id
                    where a.id_materia == id_materia 
                    && (all == 1 || b.estado == 1)
                    select new DesplegableResponse
                    {
                        id = b.id,
                        label = b.descripcion
                    }).ToList();
        }

        public List<DesplegableResponse> Condicion(int? id = null)
        {
            Expression<Func<condicion, bool>> _where = x => (id == null || x.id == id);

            return condicionRepositorio.Listar(_where).Select(x => new DesplegableResponse
            {
                id = x.id,
                label = x.descripcion
            }).ToList();
        }

        public List<DesplegableResponse> TipoResponsabilidad()
        {
            return tipoResponsabilidadRepositorio.Listar().Select(x => new DesplegableResponse
            {
                id = x.id,
                label = x.descripcion
            }).ToList();
        }

        public List<DesplegableResponse> EtapaProcesal()
        {
            return etapaProcesalRepositorio.Listar().Select(x => new DesplegableResponse
            {
                id = x.ID,
                label = x.DESCRIPCION
            }).ToList();
        }

        public List<DesplegableResponse> Abogados()
        {
            try
            {
                return trabajadorProduceRepositorio.Listar(x => x.ESTADO == "ACTIVO" && x.CODDEP == 15 && x.CONDICION != "GENERAL")
                    .Select(x => new DesplegableResponse
                    {
                        id = x.CODIGO_TRABAJADOR,
                        label = x.NOMBRES_TRABAJADOR.ToUpper() + " " + x.APELLIDOS_TRABAJADOR.ToUpper()
                    }).OrderBy(x => x.label).ToList();

            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }

            return null;
        }

        public List<DesplegableResponse> TipoInstancia(int id_tipo_proceso)
        {
            return tipoInstanciaRepositorio.Listar(x => x.id_tipo_proceso == id_tipo_proceso)
                .Select(x => new DesplegableResponse
                {
                    id = x.id_tipo_instancia,
                    label = x.nombre_tipo_instancia
                }).OrderBy(x => x.label).ToList();
        }


        public List<DesplegableResponse> TipoPlazo(int id_tipo_instancia)
        {
            return tipoPlazoRepositorio.Listar(x => x.id_tipo_instancia == id_tipo_instancia)
                .Select(x => new DesplegableResponse
                {
                    id = x.id_plazo,
                    label = x.nombre_plazo + " - " + x.dias_plazo + " días"
                }).OrderBy(x => x.label).ToList();
        }

        public List<DesplegableResponse> TipoMonto()
        {
            return tipoMontoRepositorio.Listar()
                .Select(x => new DesplegableResponse
                {
                    id = x.ID,
                    label = x.DESCRIPCION
                }).OrderBy(x => x.label).ToList();
        }
    }
}
