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
    
    public partial class VW_TIPO_PLAZO
    {
        public Nullable<int> ID_TIPO_PROCESO { get; set; }
        public Nullable<int> ID_MATERIA { get; set; }
        public string MATERIA_DESCRIPCION { get; set; }
        public string TIPO_PROCESO_DESCRIPCION { get; set; }
        public Nullable<int> ESTADO_TIPO_PROCESO { get; set; }
        public Nullable<int> ORDEN_TIPO_PROCESO { get; set; }
        public Nullable<int> ID_TIPO_INSTANCIA { get; set; }
        public string NOMBRE_TIPO_INSTANCIA { get; set; }
        public int ID_PLAZO { get; set; }
        public string NOMBRE_PLAZO { get; set; }
        public Nullable<decimal> DIAS_PLAZO { get; set; }
    }
}
