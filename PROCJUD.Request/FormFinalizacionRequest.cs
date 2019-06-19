using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Request
{
    public class FormFinalizacionRequest
    {
        public string tipo_finalizacion { get; set; }

        public string motivo { get; set; }

        public DateTime? fecha_finalizacion { get; set; }

        public decimal cantidad { get; set; }

        public int estado_archivamiento { get; set; }

        public string resolucion { get; set; }

        public string usuario { get; set; }

        public int id_tipo_monto { get; set; }
    }
}
