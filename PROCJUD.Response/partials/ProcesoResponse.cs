using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Response
{
    public partial class ProcesoResponse
    {
        public List<RzProcuraduriaResponse> personas { get; set; }

        public List<EmbxprocesoResponse> embarcaciones { get; set; }

        public List<ResolimpugnadaxprocesoResponse> resoluciones { get; set; }

        public List<PlantaxprocesoResponse> plantas { get; set; }

        public List<EtapasResponse> etapas { get; set; }

        public SedeResponse sede { get; set; }

        public bool _readonly { get; set; }

        public string tipo_finalizacion_descripcion
        {
            get
            {
                switch (this.tipo_finalizacion)
                {
                    case 1:
                        return "Definitivo";
                    case 2:
                        return "Provisional";
                    default:
                        return "";
                }
            }
        }

        public string estado_archivamiento_descripcion
        {
            get
            {
                switch (this.estado_archivamiento)
                {
                    case 1:
                        return "A favor";
                    case 2:
                        return "En contra";
                    default:
                        return "";
                }
            }
        }
    }
}
