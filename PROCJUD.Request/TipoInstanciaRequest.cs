//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PROCJUD.Request
{
    using System;
    using System.Collections.Generic;
    
    public partial class TipoInstanciaRequest
    {
        public int id_tipo_instancia { get; set; }
        public Nullable<int> id_tipo_proceso { get; set; }
        public string nombre_tipo_instancia { get; set; }
    
        public virtual List<DatProcesoInstanciaRequest> proceso_instancia { get; set; }
        public virtual TipoProcesoRequest _proceso { get; set; }
        public virtual List<TipoPlazoRequest> _plazo { get; set; }
    }
}