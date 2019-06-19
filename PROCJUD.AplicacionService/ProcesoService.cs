using AutoMapper;
using PROCJUD.AplicacionService.Base;
using PROCJUD.Entidades;
using PROCJUD.IAplicacionService;
using PROCJUD.IRepositorio;
using PROCJUD.IRepositorio.Base;
using PROCJUD.Request;
using PROCJUD.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace PROCJUD.AplicacionService
{
    public class ProcesoService : BaseService, IProcesoService
    {

        private readonly IProcesoRepositorio procesoRepositorio;
        private readonly IDetailProcesoService detailProcesoService;
        private readonly IVwProcesoRepositorio vwProcesoRepositorio;
        private readonly IVwPersonaRepositorio vwPersonaRepositorio;
        private readonly IRzProcuraduriaRepositorio rzProcuraduriaRepositorio;
        private readonly IResolimpugnadaxprocesoRepositorio resolimpugnadaxprocesoRepositorio;
        private readonly IVwResolucionSitradocRepositorio resolucionSitradocRepositorio;
        private readonly IUnitOfWork unitOfWork;

        public ProcesoService(IProcesoRepositorio procesoRepositorio,
            IVwProcesoRepositorio vwProcesoRepositorio,
            IDetailProcesoService detailProcesoService,
            IVwPersonaRepositorio vwPersonaRepositorio,
            IRzProcuraduriaRepositorio rzProcuraduriaRepositorio,
            IResolimpugnadaxprocesoRepositorio resolimpugnadaxprocesoRepositorio,
            IVwResolucionSitradocRepositorio resolucionSitradocRepositorio,
            IUnitOfWork unitOfWork)
        {
            this.procesoRepositorio = procesoRepositorio;
            this.detailProcesoService = detailProcesoService;
            this.vwProcesoRepositorio = vwProcesoRepositorio;
            this.vwPersonaRepositorio = vwPersonaRepositorio;
            this.rzProcuraduriaRepositorio = rzProcuraduriaRepositorio;
            this.resolimpugnadaxprocesoRepositorio = resolimpugnadaxprocesoRepositorio;
            this.resolucionSitradocRepositorio = resolucionSitradocRepositorio;
            this.unitOfWork = unitOfWork;
        }

        //===============================
        //VALIDACIONES
        //===============================
        public void CanUpdateProceso(int id, int id_abogado, bool usuarioEsProcurador)
        {
            var proceso = this.procesoRepositorio.ListarUno(x => x.id == id);

            if (proceso == null || (proceso.ESTADO_PROCESO == 1 && (!usuarioEsProcurador || proceso.ID_ABOGADO != id_abogado)))
                this.Abort(403, "No tiene permisos para realizar la acción solicitada");

        }
        //===============================

        public ProcesoResponse GetSimpleProceso(int id)
        {
            return this.procesoRepositorio.Listar(x => x.id == id).Select(x => new ProcesoResponse
            {
                id = x.id,
                id_abogado = x.ID_ABOGADO,
                materia = x.materia,
                id_tipo_proceso = x.id_tipo_proceso,
                id_naturaleza = x.id_naturaleza,
                sector = x.sector,
                id_opd = x.id_opd
            }).FirstOrDefault();
        }

        public PaginationResponse<VwProcesoResponse> Page(int page, int pageSize, ProcesoFilters filters, int codigo_trabajador, bool usuarioEsProcurador)
        {
            if (filters.fecha_fin != null) filters.fecha_fin = filters.fecha_fin.Value.AddDays(1);
            try
            {
                var procesos = this.procesoRepositorio.PaginaProc(page, pageSize, filters);
                var total = this.procesoRepositorio.ContarProc(filters);
                var items = Mapper.Map<List<VW_PROCESO>, List<VwProcesoResponse>>(procesos);
                items.ForEach(x =>
                {
                    x._showFinalizarButton = usuarioEsProcurador;
                    x._readonly = this.IsReadonly(new ProcesoResponse { estado_proceso = x.estado_proceso, id_abogado = x.id_abogado }, codigo_trabajador, usuarioEsProcurador);
                    x.personas = detailProcesoService.ListarPersonas(x.id);
                    x.resoluciones = detailProcesoService.ListarResoluciones(x.id);
                    x.instancias = detailProcesoService.ListarInstancias(x.id);
                });

                return new PaginationResponse<VwProcesoResponse>
                {
                    items = items,
                    total = total,
                    page = page,
                    pageSize = pageSize
                };
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }

            return null;
        }

        public ProcesoResponse Get(int id)
        {
            var proceso = this.procesoRepositorio.ListarUno(x => x.id == id);
            var response = Mapper.Map<PROCESO, ProcesoResponse>(proceso);

            response.personas = this.detailProcesoService.ListarPersonas(response.id);
            response.resoluciones = this.detailProcesoService.ListarResoluciones(response.id);
            response.embarcaciones = this.detailProcesoService.ListarEmbarcaciones(response.id);
            response.plantas = this.detailProcesoService.ListarPlantas(response.id);
            response.proceso_instancia = this.detailProcesoService.ListarInstancias(response.id);
            response.etapas = this.detailProcesoService.GetEtapas(response.id);
            response.sede = this.detailProcesoService.GetSedeJudicial(response.codigo_distritojudicial, response.codigo_sede);

            return response;
        }


        public void Save(ProcesoRequest request)
        {
            var proceso = Mapper.Map<ProcesoRequest, PROCESO>(request);

            var personas = Mapper.Map<List<RzProcuraduriaRequest>, List<RZ_procuraduria>>(request.personas);

            var resoluciones = Mapper.Map<List<ResolimpugnadaxprocesoRequest>, List<RESOLIMPUGNADAXPROCESO>>(request.resoluciones);

            var plantas = Mapper.Map<List<PlantaxprocesoRequest>, List<PLANTAXPROCESO>>(request.plantas);

            var embarcaciones = Mapper.Map<List<EmbxprocesoRequest>, List<EMBXPROCESO>>(request.embarcaciones);

            var proceso_instancia_documentos = Mapper.Map<List<DatProcesoInstanciaDocumentoRequest>, List<DAT_PROCESO_INSTANCIA_DOCUMENTO>>(request._instancia.documentos);

            var proceso_instancia = this.MapProcesoInstanciaForSave(request._instancia);

            var proceso_plazo = this.MapProcesoPlazoForSave(request._instancia, request.id_abogado);

            var validation = proceso.ValidateNew(personas, proceso_instancia, proceso_plazo);

            if (!validation.IsValid)
                this.Abort(406, "Complete los campos requeridos", validation.errors);

            try
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    proceso_instancia = this.FillProcesoInstanciaForSave(proceso_instancia, proceso_plazo, proceso_instancia_documentos);
                    proceso.id = this.GenerateNewIdProceso();
                    proceso.correlativo = this.procesoRepositorio.Get_correlativo(proceso.materia.Value);
                    proceso.auditmod = DateTime.Now;
                    proceso.DAT_PROCESO_INSTANCIA.Add(proceso_instancia);
                    this.procesoRepositorio.Insertar(proceso);
                    this.unitOfWork.Guardar();
                    this.detailProcesoService.SavePersonas(personas, proceso.id);
                    this.detailProcesoService.SaveEmbarcaciones(embarcaciones, proceso.id);
                    this.detailProcesoService.SavePlantas(plantas, proceso.id);
                    this.unitOfWork.Guardar();
                    scope.Complete();
                }
                this.detailProcesoService.SaveResoluciones(resoluciones, proceso.id);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }

        }

        public void Finalizar(int id, FormFinalizacionRequest request)
        {
            var proceso = this.procesoRepositorio.ListarUno(x => x.id == id);

            try
            {
                using (TransactionScope scope = new TransactionScope())
                {

                    proceso.ESTADO_PROCESO = 1;
                    proceso.ESTADO_ARCHIVAMIENTO = request.estado_archivamiento;
                    proceso.TIPO_FINALIZACION = Convert.ToInt32(request.tipo_finalizacion);
                    proceso.RESOLUCION_FINALIZACION = request.resolucion;
                    proceso.FECHA_FINALIZACION = request.fecha_finalizacion.Value.ToString("dd/MM/yyyy");
                    proceso.MOTIVO_FINALIZACION = request.motivo;
                    proceso.MONTO_FINALIZACION = request.cantidad;
                    proceso.AUDIT_FINALIZACION = DateTime.Now;
                    proceso.ID_TIPO_MONTO = request.id_tipo_monto;
                    proceso.USUARIO_FINALIZACION = request.usuario;

                    proceso.DAT_PROCESO_INSTANCIA.ToList().ForEach(x =>
                    {
                        if (string.IsNullOrEmpty(x.estado))
                        {
                            x.estado = "1";
                            x.fecha_finalizacion = request.fecha_finalizacion;
                            x.tipo_finalizacion = request.estado_archivamiento.ToString();
                            x.cantidad_final = request.cantidad;
                            x.motivo_finalizacion = request.motivo;
                            x.DAT_PROCESO_PLAZO.ToList().ForEach(p =>
                            {
                                if (string.IsNullOrEmpty(p.estado))
                                {
                                    p.estado = "1";
                                    p.anotacion = request.motivo;
                                    p.fecha_final = request.fecha_finalizacion;
                                }
                            });
                        }
                    });

                    this.unitOfWork.Guardar();
                    scope.Complete();
                }
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }

        }

        public IList<VwProcesoResponse> ListParaReasignar(int id_abogado, int anio)
        {
            var legajos = this.vwProcesoRepositorio.Listar(x => x.ESTADO_PROCESO == null && x.ID_ABOGADO == id_abogado && x.numero.Contains("-" + anio)).ToList();

            //this.Abort(400, $"{id_abogado} {anio}");


            return Mapper.Map<IList<VW_PROCESO>, IList<VwProcesoResponse>>(legajos);
        }

        public void DelegacionMasivaLegajos(ProcesoDelegacionMasiva request)
        {
            var legajos = this.procesoRepositorio.Listar(x => request.legajos.Contains(x.id)).ToList();
            try
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    legajos.ForEach(legajo =>
                    {
                        if (legajo.ESTADO_PROCESO == null)
                        {
                            legajo.ID_ABOGADO = request.id_abogado;
                              //datos.USUARIO_FINALIZACION = request.usuario;
                              legajo.DAT_PROCESO_INSTANCIA.ToList().ForEach(x =>
                               {
                                x.DAT_PROCESO_PLAZO.ToList().ForEach(plazo =>
                                {
                                    if (plazo.estado != "1")
                                    {
                                        plazo.id_abogado = request.id_abogado;
                                    }
                                });
                            });
                        }
                    });
                    this.unitOfWork.Guardar();
                    scope.Complete();
                }
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }
        public void Update(int id, ProcesoRequest request)
        {
            var proceso = this.procesoRepositorio.ListarUno(x => x.id == id);

            var personas = Mapper.Map<List<RzProcuraduriaRequest>, List<RZ_procuraduria>>(request.personas);

            var resoluciones = Mapper.Map<List<ResolimpugnadaxprocesoRequest>, List<RESOLIMPUGNADAXPROCESO>>(request.resoluciones);

            var plantas = Mapper.Map<List<PlantaxprocesoRequest>, List<PLANTAXPROCESO>>(request.plantas);

            var embarcaciones = Mapper.Map<List<EmbxprocesoRequest>, List<EMBXPROCESO>>(request.embarcaciones);

            try
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    proceso.sector = request.sector;
                    proceso.id_opd = request.id_opd;
                    proceso.id_tipo_responsabilidad = request.id_tipo_responsabilidad;
                    proceso.ID_ABOGADO = request.id_abogado;
                    proceso.ID_ETAPA_PROCESAL = request.id_etapa_procesal;
                    proceso.fecVenc = request.fecvenc;
                    proceso.auditmod = DateTime.Now;
                    this.procesoRepositorio.Actualizar(proceso);
                    this.unitOfWork.Guardar();
                    scope.Complete();
                }
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        public bool IsReadonly(ProcesoResponse proceso, int codigo_trabajador, bool usuarioEsProcurador)
        {
            return proceso.estado_proceso == 1 || (!usuarioEsProcurador && proceso.id_abogado != codigo_trabajador);
        }

        #region HELPERS
        private DAT_PROCESO_INSTANCIA MapProcesoInstanciaForSave(SimpleInstanciaRequest _instancia)
        {
            return new DAT_PROCESO_INSTANCIA
            {
                id_tipo_instancia = _instancia.id_tipo_instancia,
                nombre_instancia = _instancia.nombre_instancia,
                numero_instancia = _instancia.numero_instancia,
                fecha_inicio = _instancia.fecha_inicio,
                //estado = "1"
            };
        }

        private DAT_PROCESO_PLAZO MapProcesoPlazoForSave(SimpleInstanciaRequest _instancia, int? id_abogado)
        {
            return new DAT_PROCESO_PLAZO
            {
                id_plazo = _instancia.id_plazo,
                fecha_inicio = _instancia.fecha_inicio,
                id_abogado = id_abogado,
                //estado = "1"
            };
        }

        private int GenerateNewIdProceso()
        {
            var id = this.procesoRepositorio.Listar().Any() ?
                this.procesoRepositorio.Listar().Max(x => x.id) : 0;
            return id + 1;
        }

        private DAT_PROCESO_INSTANCIA FillProcesoInstanciaForSave(
            DAT_PROCESO_INSTANCIA proceso_instancia,
            DAT_PROCESO_PLAZO proceso_plazo,
            List<DAT_PROCESO_INSTANCIA_DOCUMENTO> proceso_instancia_documentos
        )
        {
            proceso_instancia.DAT_PROCESO_PLAZO.Add(proceso_plazo);
            if (proceso_instancia_documentos != null)
            {
                proceso_instancia_documentos.ForEach(x =>
                {
                    proceso_instancia.DAT_PROCESO_INSTANCIA_DOCUMENTO.Add(x);
                });
            }
            return proceso_instancia;
        }

        #endregion

    }
}
