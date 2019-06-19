using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Response
{
    public partial class DatProcesoPlazoResponse
    {
        public string estado_descripcion
        {
            get
            {
                return string.IsNullOrEmpty(this.estado) ? "PENDIENTE" : "ATENDIDO";
            }
        }

        public string nombre_abogado { get; set; }
    }
}
