using PROCJUD.IAplicacionService;
using PROCJUD.IRepositorio;
using PROCJUD.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.AplicacionService
{
    public class GeneralService : IGeneralService
    {

        private readonly IVwEmbarcacionRepositorio embarcacionRepositorio;
        private readonly IVwPlantaPesqueraRepositorio plantaPesqueraRepositorio;
        private readonly IVwPersonaRepositorio personaRepositorio;
        private readonly IVwTrabajadorProduceRepositorio trabajadorProduceRepositorio;

        public GeneralService(IVwEmbarcacionRepositorio embarcacionRepositorio, IVwPlantaPesqueraRepositorio plantaPesqueraRepositorio, IVwPersonaRepositorio personaRepositorio, IVwTrabajadorProduceRepositorio trabajadorProduceRepositorio)
        {
            this.embarcacionRepositorio = embarcacionRepositorio;
            this.plantaPesqueraRepositorio = plantaPesqueraRepositorio;
            this.personaRepositorio = personaRepositorio;
            this.trabajadorProduceRepositorio = trabajadorProduceRepositorio;
        }

        public List<VwEmbarcacionResponse> BuscarEmbarcacion(string nombre, int limit = 5)
        {
            return this.embarcacionRepositorio.Listar(x => x.NOMBRE_EMB.Contains(nombre) || x.MATRICULA_EMB.Contains(nombre), 1, limit)
                .Select(x => new VwEmbarcacionResponse
                {
                    id_emb = x.ID_EMB,
                    nombre_emb = x.NOMBRE_EMB,
                    matricula_emb = x.MATRICULA_EMB
                }).ToList();
        }

        public List<VwPlantaPesqueraResponse> BuscarPlanta(string nombre, int limit = 5)
        {
            return this.plantaPesqueraRepositorio.Listar(x => x.NOMBRE.Contains(nombre), 1, limit).Select(x => new VwPlantaPesqueraResponse
            {
                id = x.ID,
                nombre = x.NOMBRE
            }).ToList();
        }

        public List<VwPersonaResponse> BuscarPersona(string nombre, int limit = 5)
        {
            return this.personaRepositorio.Listar(x => x.NOMBRE.Contains(nombre), 1, limit).Select(x => new VwPersonaResponse
            {
                id = x.ID,
                nombre = x.NOMBRE
            }).ToList();
        }

        public VwPersonaResponse GetPersona(int? id)
        {
            return this.personaRepositorio.Listar(x => x.ID == id)
                .Select(x => new VwPersonaResponse
                {
                    id = x.ID,
                    nombre = x.NOMBRE
                }).FirstOrDefault();
        }

        public VwEmbarcacionResponse GetEmbarcacion(int? id)
        {
            return this.embarcacionRepositorio.Listar(x => x.ID_EMB == id).Select(x => new VwEmbarcacionResponse
            {
                id_emb = x.ID_EMB,
                nombre_emb = x.NOMBRE_EMB,
                matricula_emb = x.MATRICULA_EMB
            }).FirstOrDefault();
        }

        public VwPlantaPesqueraResponse GetPlanta(int? id)
        {
            return this.plantaPesqueraRepositorio.Listar(x => x.ID == id).Select(x => new VwPlantaPesqueraResponse
            {
                id = x.ID,
                nombre = x.NOMBRE
            }).FirstOrDefault();
        }

        public VwTrabajadorProduceResponse GetTrabajador(int id_trabajador)
        {
            return this.trabajadorProduceRepositorio.Listar(x => x.CODIGO_TRABAJADOR == id_trabajador)
                .Select(x => new VwTrabajadorProduceResponse
                {
                    codigo_trabajador = x.CODIGO_TRABAJADOR,
                    nombres_trabajador = x.NOMBRES_TRABAJADOR,
                    apellidos_trabajador = x.APELLIDOS_TRABAJADOR,
                    coddep = x.CODDEP
                }).FirstOrDefault();
        }
    }
}
