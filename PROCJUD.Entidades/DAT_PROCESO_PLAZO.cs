//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PROCJUD.Entidades
{
    using System;
    using System.Collections.Generic;
    
    public partial class DAT_PROCESO_PLAZO
    {
        public int id_proceso_plazo { get; set; }
        public int id_plazo { get; set; }
        public int id_proceso_instancia { get; set; }
        public Nullable<int> id_abogado { get; set; }
        public Nullable<System.DateTime> fecha_inicio { get; set; }
        public Nullable<System.DateTime> fecha_final { get; set; }
        public string estado { get; set; }
        public string anotacion { get; set; }
    
        public virtual DAT_PROCESO_INSTANCIA DAT_PROCESO_INSTANCIA { get; set; }
        public virtual TIPO_PLAZO TIPO_PLAZO { get; set; }
    }
}
