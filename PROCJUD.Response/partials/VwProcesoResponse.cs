using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Response
{
    public partial class VwProcesoResponse
    {
        public bool _readonly { get; set; }

        public bool _showFinalizarButton { get; set; }

        public List<ResolimpugnadaxprocesoResponse> resoluciones;

        public List<RzProcuraduriaResponse> personas;

        public List<DatProcesoInstanciaResponse> instancias;

    }
}
