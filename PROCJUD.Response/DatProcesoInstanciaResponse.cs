//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PROCJUD.Response
{
    using System;
    using System.Collections.Generic;
    
    public partial class DatProcesoInstanciaResponse
    {
        public int id_proceso_instancia { get; set; }
        public int id_tipo_instancia { get; set; }
        public Nullable<int> id_proceso { get; set; }
        public string nombre_instancia { get; set; }
        public string numero_instancia { get; set; }
        public Nullable<System.DateTime> fecha_inicio { get; set; }
        public string estado { get; set; }
        public Nullable<decimal> cantidad_inicial { get; set; }
        public Nullable<decimal> cantidad_final { get; set; }
        public string tipo_finalizacion { get; set; }
        public Nullable<int> id_monto { get; set; }
        public string motivo_finalizacion { get; set; }
        public Nullable<System.DateTime> fecha_finalizacion { get; set; }
    
        public virtual List<DatProcesoInstanciaDocumentoResponse> proceso_instancia_documento { get; set; }
        public virtual List<DatProcesoPlazoResponse> proceso_plazo { get; set; }
        public virtual ProcesoResponse eso { get; set; }
        public virtual TipoInstanciaResponse _instancia { get; set; }
        public virtual TipoMontoResponse _monto { get; set; }
    }
}
