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
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.AplicacionService
{
    public class DetailProcesoService : BaseService, IDetailProcesoService
    {
        private readonly IProcesoRepositorio procesoRepositorio;
        private readonly IRzProcuraduriaRepositorio rzProcuraduriaRepositorio;
        private readonly IEmbxprocesoRepositorio embxprocesoRepositorio;
        private readonly IPlantaxprocesoRepositorio plantaxprocesoRepositorio;
        private readonly IResolimpugnadaxprocesoRepositorio resolimpugnadaxprocesoRepositorio;
        private readonly IDatProcesoInstanciaRepositorio procesoInstanciaRepositorio;
        private readonly IDatProcesoInstanciaDocumentoRepositorio procesoInstanciaDocumentoRepositorio;
        private readonly IDatProcesoPlazoRepositorio procesoPlazoRepositorio;
        private readonly IGeneralService generalService;
        private readonly IEnumerableService enumerableService;
        private readonly ISitradocService sitradocService;
        private readonly IEtapasRepositorio etapasRepositorio;
        private readonly ISedeRepositorio sedeRepositorio;
        private readonly IDistritojudicialRepositorio distritojudicialRepositorio;
        private readonly IUnitOfWork unitOfWork;

        public DetailProcesoService(IProcesoRepositorio procesoRepositorio,
            IRzProcuraduriaRepositorio rzProcuraduriaRepositorio,
            IEmbxprocesoRepositorio embxprocesoRepositorio,
            IPlantaxprocesoRepositorio plantaxprocesoRepositorio,
            IResolimpugnadaxprocesoRepositorio resolimpugnadaxprocesoRepositorio,
            IDatProcesoInstanciaRepositorio procesoInstanciaRepositorio,
            IDatProcesoPlazoRepositorio procesoPlazoRepositorio,
            IDatProcesoInstanciaDocumentoRepositorio procesoInstanciaDocumentoRepositorio,
            IGeneralService generalService,
            IEnumerableService enumerableService,
            ISitradocService sitradocService,
            IEtapasRepositorio etapasRepositorio,
            ISedeRepositorio sedeRepositorio,
            IDistritojudicialRepositorio distritojudicialRepositorio,
            IUnitOfWork unitOfWork)
        {
            this.procesoRepositorio = procesoRepositorio;
            this.rzProcuraduriaRepositorio = rzProcuraduriaRepositorio;
            this.embxprocesoRepositorio = embxprocesoRepositorio;
            this.plantaxprocesoRepositorio = plantaxprocesoRepositorio;
            this.resolimpugnadaxprocesoRepositorio = resolimpugnadaxprocesoRepositorio;
            this.procesoInstanciaRepositorio = procesoInstanciaRepositorio;
            this.generalService = generalService;
            this.enumerableService = enumerableService;
            this.sitradocService = sitradocService;
            this.procesoPlazoRepositorio = procesoPlazoRepositorio;
            this.procesoInstanciaDocumentoRepositorio = procesoInstanciaDocumentoRepositorio;
            this.etapasRepositorio = etapasRepositorio;
            this.sedeRepositorio = sedeRepositorio;
            this.distritojudicialRepositorio = distritojudicialRepositorio;
            this.unitOfWork = unitOfWork;
        }

        //==================================
        //PERSONAS
        //==================================

        public List<RzProcuraduriaResponse> ListarPersonas(int id_proceso)
        {
            var personas = this.rzProcuraduriaRepositorio.Listar(x => x.id_proceso == id_proceso).Select(x => new RzProcuraduriaResponse
            {
                id = x.id,
                id_proceso = x.id_proceso,
                id_persona = x.id_persona,
                condicion = x.condicion,
            }).ToList();

            personas.ForEach(x =>
            {
                if (string.IsNullOrEmpty(x.razonsocial))
                {
                    var persona = generalService.GetPersona(x.id_persona);
                    x.razonsocial = persona == null ? "-" : persona.nombre;
                }

                var condicion = this.enumerableService.Condicion(x.condicion).FirstOrDefault();
                x.descripcion_condicion = condicion == null ? "" : condicion.label;
            });

            return personas;
        }

        public void SavePersonas(List<RZ_procuraduria> personas, int id_proceso)
        {
            if (personas != null)
            {
                personas.ForEach(x =>
                {
                    x.id = this.GenerateNewIdPersona();
                    x.auditmod = DateTime.Now;
                    x.id_proceso = id_proceso;
                    this.rzProcuraduriaRepositorio.Insertar(x);
                    this.unitOfWork.Guardar();
                });
            }
        }

        public void DeletePersona(int id_rz)
        {
            try
            {
                var entity = this.rzProcuraduriaRepositorio.ListarUno(x => x.id == id_rz);
                this.rzProcuraduriaRepositorio.Eliminar(entity);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }

        }

        public void SavePersona(RzProcuraduriaRequest request, int id_proceso)
        {
            var persona = Mapper.Map<RzProcuraduriaRequest, RZ_procuraduria>(request);
            try
            {
                persona.id = this.GenerateNewIdPersona();
                persona.auditmod = DateTime.Now;
                persona.id_proceso = id_proceso;
                this.rzProcuraduriaRepositorio.Insertar(persona);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        //==================================
        //RESOLUCIONES
        //==================================

        public List<ResolimpugnadaxprocesoResponse> ListarResoluciones(int id_proceso)
        {
            var resoluciones = this.resolimpugnadaxprocesoRepositorio.Listar(x => x.ID_PROCESO == id_proceso).Select(x => new ResolimpugnadaxprocesoResponse
            {
                id = x.ID,
                id_proceso = x.ID_PROCESO,
                id_resolucion = x.ID_RESOLUCION,
                id_resolucion_consav = x.ID_RESOLUCION_CONSAV
            }).ToList();

            resoluciones.ForEach(x =>
            {
                if (x.id_resolucion != 0)
                {
                    var resolucion = sitradocService.Resolucion(x.id_resolucion);
                    x.numero = resolucion == null ? "-" : resolucion.nro_resol;
                }
            });

            return resoluciones;
        }

        public void SaveResoluciones(List<RESOLIMPUGNADAXPROCESO> resoluciones, int id_proceso)
        {
            if (resoluciones != null)
            {
                resoluciones.ForEach(x =>
                {
                    x.ID_RESOLUCION_CONSAV = this.procesoRepositorio.Get_id_resolucion_consav(x.ID_RESOLUCION);
                    x.AUDITMOD = DateTime.Now;
                    x.ID_PROCESO = id_proceso;
                    this.resolimpugnadaxprocesoRepositorio.Insertar(x);
                });
            }
        }

        public void SaveResolucion(ResolimpugnadaxprocesoRequest request, int id_proceso)
        {
            var resolucion = Mapper.Map<ResolimpugnadaxprocesoRequest, RESOLIMPUGNADAXPROCESO>(request);
            try
            {
                resolucion.ID_RESOLUCION_CONSAV = this.procesoRepositorio.Get_id_resolucion_consav(resolucion.ID_RESOLUCION);
                resolucion.AUDITMOD = DateTime.Now;
                resolucion.ID_PROCESO = id_proceso;
                this.resolimpugnadaxprocesoRepositorio.Insertar(resolucion);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        public void DeleteResolucion(int id_resolxproceso)
        {
            try
            {
                var entity = this.resolimpugnadaxprocesoRepositorio.ListarUno(x => x.ID == id_resolxproceso);
                this.resolimpugnadaxprocesoRepositorio.Eliminar(entity);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        //==================================
        //PLANTAS
        //==================================

        public List<PlantaxprocesoResponse> ListarPlantas(int id_proceso)
        {
            var plantas = this.plantaxprocesoRepositorio.Listar(x => x.ID_PROCESO == id_proceso).Select(x => new PlantaxprocesoResponse
            {
                id = x.ID,
                id_proceso = x.ID_PROCESO,
                id_persona = x.ID_PERSONA,
                nombre = x.NOMBRE
            }).ToList();

            plantas.ForEach(x =>
            {
                if (string.IsNullOrEmpty(x.nombre))
                {
                    var planta = generalService.GetPersona(x.id_persona);
                    x.nombre = planta == null ? "-" : planta.nombre;
                }
            });

            return plantas;
        }

        public void SavePlantas(List<PLANTAXPROCESO> plantas, int id_proceso)
        {
            if (plantas != null)
            {
                plantas.ForEach(x =>
                {
                    x.AUDITMOD = DateTime.Now;
                    x.ID_PROCESO = id_proceso;
                    this.plantaxprocesoRepositorio.Insertar(x);
                });
            }
        }

        public void SavePlanta(PlantaxprocesoRequest request, int id_proceso)
        {
            var planta = Mapper.Map<PlantaxprocesoRequest, PLANTAXPROCESO>(request);
            try
            {
                planta.AUDITMOD = DateTime.Now;
                planta.ID_PROCESO = id_proceso;
                this.plantaxprocesoRepositorio.Insertar(planta);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        public void DeletePlanta(int id_plantaxproceso)
        {
            try
            {
                var entity = this.plantaxprocesoRepositorio.ListarUno(x => x.ID == id_plantaxproceso);
                this.plantaxprocesoRepositorio.Eliminar(entity);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        //==================================
        //EMBARCACIONES
        //==================================

        public List<EmbxprocesoResponse> ListarEmbarcaciones(int id_proceso)
        {
            var embarcaciones = this.embxprocesoRepositorio.Listar(x => x.ID_PROCESO == id_proceso).Select(x => new EmbxprocesoResponse
            {
                id = x.ID,
                id_proceso = x.ID_PROCESO,
                id_emb = x.ID_EMB,
                matricula = x.MATRICULA,
                nombre = x.NOMBRE
            }).ToList();

            embarcaciones.ForEach(x =>
            {
                if (string.IsNullOrEmpty(x.nombre) || string.IsNullOrEmpty(x.matricula))
                {
                    var embarcacion = generalService.GetEmbarcacion(x.id_emb);
                    x.nombre = embarcacion == null ? "-" : embarcacion.nombre_emb;
                    x.matricula = embarcacion == null ? "-" : embarcacion.matricula_emb;
                }
            });

            return embarcaciones;
        }

        public void SaveEmbarcaciones(List<EMBXPROCESO> embarcaciones, int id_proceso)
        {
            if (embarcaciones != null)
            {
                embarcaciones.ForEach(x =>
                {
                    x.AUDITMOD = DateTime.Now;
                    x.ID_PROCESO = id_proceso;
                    this.embxprocesoRepositorio.Insertar(x);
                });
            }
        }

        public void SaveEmbarcacion(EmbxprocesoRequest request, int id_proceso)
        {
            var embarcacion = Mapper.Map<EmbxprocesoRequest, EMBXPROCESO>(request);
            try
            {
                embarcacion.AUDITMOD = DateTime.Now;
                embarcacion.ID_PROCESO = id_proceso;
                this.embxprocesoRepositorio.Insertar(embarcacion);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        public void DeleteEmbarcacion(int id_embxproceso)
        {
            try
            {
                var entity = this.embxprocesoRepositorio.ListarUno(x => x.ID == id_embxproceso);
                this.embxprocesoRepositorio.Eliminar(entity);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        //==================================
        //INSTANCIAS
        //==================================

        public List<DatProcesoInstanciaResponse> ListarInstancias(int id_proceso)
        {
            var lista = this.procesoInstanciaRepositorio.Listar(x => x.id_proceso == id_proceso).ToList();

            var instancias = Mapper.Map<List<DAT_PROCESO_INSTANCIA>, List<DatProcesoInstanciaResponse>>(lista);

            /*instancias.ForEach(x =>
            {
                x.proceso_instancia_documento.ForEach(d =>
                {
                    if (d.id_documento != null)
                    {
                        var doc = this.sitradocService.Documento(d.id_documento.Value);
                        d.numero_documento_sitradoc = doc?.num_tram_documentario;
                        d.fecha_documento_sitradoc = doc?.auditmod.ToString("dd/MM/yyyy");
                    }
                });
            });*/

            return instancias;
        }

        public DatProcesoInstanciaResponse ListarInstancia(int id_proceso_instancia)
        {
            var entity = this.procesoInstanciaRepositorio.ListarUno(x => x.id_proceso_instancia == id_proceso_instancia);

            if (entity == null)
                this.Abort(404, "No existe el recurso solicitado");

            var instancia = Mapper.Map<DAT_PROCESO_INSTANCIA, DatProcesoInstanciaResponse>(entity);

            instancia.proceso_instancia_documento.ForEach(d =>
            {
                if (d.id_documento != null)
                {
                    var doc = this.sitradocService.Documento(d.id_documento.Value);
                    d.numero_documento_sitradoc = doc?.num_tram_documentario;
                    d.fecha_documento_sitradoc = doc?.auditmod.ToString("dd/MM/yyyy");
                }
            });

            instancia.proceso_plazo.ForEach(p =>
            {
                if (p.id_abogado != null)
                {
                    var abogado = this.generalService.GetTrabajador(p.id_abogado.Value);
                    if (abogado != null)
                        p.nombre_abogado = string.Format("{0} {1}", abogado.nombres_trabajador, abogado.apellidos_trabajador);
                }
            });

            return instancia;
        }

        public void SaveInstancia(SimpleInstanciaRequest request, int id_proceso)
        {
            var proceso_instancia = this.MapProcesoInstanciaForSave(request);
            var proceso_plazo = this.MapProcesoPlazoForSave(request);

            var validation = proceso_instancia.ValidateNew(proceso_plazo);

            if (!validation.IsValid)
                this.Abort(406, "Complete los campos requeridos", validation.errors);

            try
            {
                proceso_instancia.id_proceso = id_proceso;
                proceso_instancia.DAT_PROCESO_PLAZO.Add(proceso_plazo);
                this.procesoInstanciaRepositorio.Insertar(proceso_instancia);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }

        }

        public void DeleteInstancia(int id_proceso_instancia)
        {

        }

        public void UpdateInstancia(DatProcesoInstanciaRequest request, int id_proceso_instancia)
        {
            var entityRequest = Mapper.Map<DatProcesoInstanciaRequest, DAT_PROCESO_INSTANCIA>(request);
            var proceso_instancia = this.procesoInstanciaRepositorio.ListarUno(x => x.id_proceso_instancia == id_proceso_instancia);

            if (proceso_instancia == null)
                this.Abort(404, "No se encontró el recurso solicitado");

            var validation = entityRequest.ValidateUpdate();

            if (!validation.IsValid)
                this.Abort(406, "Complete los campos requeridos", validation.errors);

            try
            {
                proceso_instancia.nombre_instancia = entityRequest.nombre_instancia;
                proceso_instancia.numero_instancia = entityRequest.numero_instancia;
                proceso_instancia.fecha_inicio = entityRequest.fecha_inicio;
                proceso_instancia.id_monto = entityRequest.id_monto;
                proceso_instancia.cantidad_inicial = entityRequest.cantidad_inicial;
                this.procesoInstanciaRepositorio.Actualizar(proceso_instancia);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        public void FinalizaInstancia(FormFinalizacionRequest request, int id_proceso_instancia)
        {
            var proceso_instancia = this.procesoInstanciaRepositorio.ListarUno(x => x.id_proceso_instancia == id_proceso_instancia);

            if (proceso_instancia == null)
                this.Abort(404, "Recurso no encontrado");

            try
            {
                proceso_instancia.cantidad_final = request.cantidad;
                proceso_instancia.fecha_finalizacion = request.fecha_finalizacion;
                proceso_instancia.tipo_finalizacion = request.tipo_finalizacion;
                proceso_instancia.motivo_finalizacion = request.motivo;
                proceso_instancia.estado = "1";
                proceso_instancia.DAT_PROCESO_PLAZO.ToList().ForEach(x =>
                {
                    if (string.IsNullOrEmpty(x.estado))
                    {
                        x.estado = "1";
                        x.anotacion = request.motivo;
                        x.fecha_final = request.fecha_finalizacion;
                    }
                });
                this.procesoInstanciaRepositorio.Actualizar(proceso_instancia);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }

        }

        public bool InstanciaReadOnly(ProcesoResponse proceso, DatProcesoInstanciaResponse instancia, int codigo_trabajador, bool usuarioEsProcurador)
        {
            return !instancia.estaPendiente || (!usuarioEsProcurador && proceso.id_abogado != codigo_trabajador);
        }


        //==================================
        //DOCUMENTOS
        //==================================
        public DatProcesoInstanciaDocumentoResponse ListarInstanciaDocumento(int id_proceso_instancia_documento)
        {
            var proceso_instancia = this.procesoInstanciaDocumentoRepositorio.ListarUno(x => x.id_proceso_instancia_documento == id_proceso_instancia_documento);

            if (proceso_instancia == null)
                this.Abort(404, "Recurso no encontrado");

            return Mapper.Map<DAT_PROCESO_INSTANCIA_DOCUMENTO, DatProcesoInstanciaDocumentoResponse>(proceso_instancia);
        }

        public void SaveDocumento(DatProcesoInstanciaDocumentoRequest request, int id_proceso_instancia)
        {

            var proceso_instancia = this.procesoInstanciaRepositorio.ListarUno(x => x.id_proceso_instancia == id_proceso_instancia);

            if (proceso_instancia == null)
                this.Abort(404, "Recurso no encontrado");

            var documento = new DAT_PROCESO_INSTANCIA_DOCUMENTO
            {
                id_documento = request.id_documento,
                numero_documento = request.numero_documento,
                fecha_documento = request.fecha_documento,
                archivo = request.archivo
            };

            try
            {
                proceso_instancia.DAT_PROCESO_INSTANCIA_DOCUMENTO.Add(documento);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }

        }

        public void DeleteDocumento(int id_proceso_instancia, int id_proceso_instancia_documento)
        {
            var proceso_instancia = this.procesoInstanciaRepositorio.ListarUno(x => x.id_proceso_instancia == id_proceso_instancia);

            if (proceso_instancia == null)
                this.Abort(404, "Recurso no encontrado");

            try
            {
                var documento = proceso_instancia.DAT_PROCESO_INSTANCIA_DOCUMENTO
                    .FirstOrDefault(x => x.id_proceso_instancia_documento == id_proceso_instancia_documento);

                if (documento != null)
                {
                    proceso_instancia.DAT_PROCESO_INSTANCIA_DOCUMENTO.Remove(documento);
                    this.unitOfWork.Guardar();
                }
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        //==================================
        //PLAZOS
        //==================================

        public void SavePlazo(DatProcesoPlazoRequest request, int id_proceso_instancia)
        {

            var proceso_instancia = this.procesoInstanciaRepositorio.ListarUno(x => x.id_proceso_instancia == id_proceso_instancia);

            if (proceso_instancia == null)
                this.Abort(404, "Recurso no encontrado");

            var proceso_plazo = Mapper.Map<DatProcesoPlazoRequest, DAT_PROCESO_PLAZO>(request);

            //var validation = proceso_plazo.ValidateNew();

            /*if (!validation.IsValid)
                this.Abort(406, "Complete los campos requeridos", validation.errors);*/

            try
            {
                proceso_instancia.DAT_PROCESO_PLAZO.Add(proceso_plazo);
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }

        }

        public void UpdatePlazo(DatProcesoPlazoRequest request, int id_proceso_plazo)
        {
            var proceso_plazo = this.procesoPlazoRepositorio.ListarUno(x => x.id_proceso_plazo == id_proceso_plazo);

            if (proceso_plazo == null)
                this.Abort(404, "Recurso no encontrado");

            try
            {
                proceso_plazo.id_plazo = request.id_plazo;
                proceso_plazo.id_abogado = request.id_abogado;
                proceso_plazo.fecha_inicio = request.fecha_inicio;
                proceso_plazo.id_abogado = request.id_abogado;
                proceso_plazo.fecha_final = request.fecha_final;
                proceso_plazo.anotacion = request.anotacion;
                if (proceso_plazo.fecha_final != null)
                {
                    proceso_plazo.estado = "1";
                }
                this.procesoPlazoRepositorio.Actualizar(proceso_plazo);
                proceso_plazo.DAT_PROCESO_INSTANCIA.PROCESO.ID_ABOGADO = proceso_plazo.id_abogado;
                this.unitOfWork.Guardar();
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }

        public void DeletePlazo(int id_proceso_instancia, int id_proceso_plazo)
        {
            var proceso_instancia = this.procesoInstanciaRepositorio.ListarUno(x => x.id_proceso_instancia == id_proceso_instancia);

            if (proceso_instancia == null)
                this.Abort(404, "Recurso no encontrado");

            try
            {
                var plazo = proceso_instancia.DAT_PROCESO_PLAZO
                    .FirstOrDefault(x => x.id_proceso_plazo == id_proceso_plazo);

                if (plazo != null)
                {
                    this.procesoPlazoRepositorio.Eliminar(plazo);
                    this.unitOfWork.Guardar();
                }
            }
            catch (Exception e)
            {
                Abort(500, "Ocurrió un error interno", null, e);
            }
        }


        public List<EtapasResponse> GetEtapas(int id_proceso)
        {
            var etapas = this.etapasRepositorio.Listar(x => x.id_proceso == id_proceso);

            return etapas.Select(x => new EtapasResponse
            {
                id_proceso = x.id,
                auditmod = x.auditmod,
                descripcion = x.descripcion,
                anotacion = x.ANOTACION
            }).ToList();
        }

        public SedeResponse GetSedeJudicial(string codigo_distrito_judicial, string codigo_sede)
        {

            var response = new SedeResponse();

            var sede = this.sedeRepositorio.ListarUno(x => x.codigo_distritojudicial == codigo_distrito_judicial && x.codigo_sede == codigo_sede);

            if (sede == null)
                return response;

            response.descripcion = sede.descripcion;

            var distrito_judicial = this.distritojudicialRepositorio.ListarUno(x => x.codigo_distritojudicial == codigo_distrito_judicial);

            if (distrito_judicial == null)
                return response;

            response.distrito_judicial = distrito_judicial.descripcion;

            return response;
        }


        #region HELPERS
        private int GenerateNewIdPersona()
        {
            var id = this.rzProcuraduriaRepositorio.Listar().Any() ?
                this.rzProcuraduriaRepositorio.Listar().Max(x => x.id) : 0;
            return id + 1;
        }

        private DAT_PROCESO_INSTANCIA MapProcesoInstanciaForSave(SimpleInstanciaRequest _instancia)
        {
            return new DAT_PROCESO_INSTANCIA
            {
                id_tipo_instancia = _instancia.id_tipo_instancia,
                nombre_instancia = _instancia.nombre_instancia,
                numero_instancia = _instancia.numero_instancia,
                fecha_inicio = _instancia.fecha_inicio,
                cantidad_inicial = _instancia.cantidad_inicial,
                id_monto = _instancia.id_monto
            };
        }

        private DAT_PROCESO_PLAZO MapProcesoPlazoForSave(SimpleInstanciaRequest _instancia)
        {
            return new DAT_PROCESO_PLAZO
            {
                id_plazo = _instancia.id_plazo,
                fecha_inicio = _instancia.fecha_notificacion,
                id_abogado = _instancia.id_abogado
            };
        }

        #endregion
    }
}
