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
    
    public partial class TipoProcesoResponse
    {
        public int id { get; set; }
        public Nullable<int> id_materia { get; set; }
        public string descripcion { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> orden { get; set; }
    
        public virtual List<TipoInstanciaResponse> _instancia { get; set; }
    }
}
