using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Request
{
    public class SimpleInstanciaRequest
    {
        public int id_tipo_instancia { get; set; }

        public string nombre_instancia { get; set; }

        public string numero_instancia { get; set; }

        public Nullable<System.DateTime> fecha_inicio { get; set; }

        public Nullable<decimal> cantidad_inicial { get; set; }

        public int id_plazo { get; set; }

        public List<DatProcesoInstanciaDocumentoRequest> documentos { get; set; }

        public Nullable<System.DateTime> fecha_notificacion { get; set; }

        public int? id_abogado { get; set; }

        public int? id_monto { get; set; }
    }
}
