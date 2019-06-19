using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Request
{
    public partial class ProcesoRequest
    {
        public SimpleInstanciaRequest _instancia { get; set; }

        public List<RzProcuraduriaRequest> personas { get; set; }

        public List<EmbxprocesoRequest> embarcaciones { get; set; }

        public List<ResolimpugnadaxprocesoRequest> resoluciones { get; set; }

        public List<PlantaxprocesoRequest> plantas { get; set; }
    }
}
