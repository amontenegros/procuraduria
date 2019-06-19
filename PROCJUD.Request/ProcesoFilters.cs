using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Request
{
    public class ProcesoFilters
    {
        public string numero { get; set; }
        public int? id_naturaleza { get; set; }
        public int? id_tipo_proceso { get; set; }
        public int? id_materia { get; set; }
        public string razon_social { get; set; }
        public int? id_abogado { get; set; }
        public string numero_resolucion { get; set; }
        public DateTime? fecha_inicio { get; set; }
        public DateTime? fecha_fin { get; set; }
        public int? id_estado { get; set; }
        public string expediente_judicial { get; set; }
    }
}
