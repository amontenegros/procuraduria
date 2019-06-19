using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Response
{
    public partial class DatProcesoInstanciaResponse
    {
        public bool _readonly { get; set; }
        public bool estaPendiente
        {
            get
            {
                return this.estado == null;
            }
        }
        public string estado_descripcion
        {
            get
            {
                return this.estado == "1" ? "FINALIZADO" : "PENDIENTE";
            }
        }

        public string veredicto
        {
            get
            {
                switch (tipo_finalizacion)
                {
                    case "1":
                        return "A FAVOR";
                    case "2":
                        return "EN CONTRA";
                    default:
                        return "-";
                }
            }
        }

        public string monto_descripcion
        {
            get
            {
                if (this.id_monto == null || this.cantidad_inicial == null)
                    return "-";

                var resp = String.Empty;

                resp += string.Format("{0} {1}",
                    (this.cantidad_final == null ? this.cantidad_inicial : this.cantidad_final),
                    _monto.descripcion);

                return resp;
            }
        }
    }
}
