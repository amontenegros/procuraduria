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
    
    public partial class VW_DAT_PROCESO_PLAZO
    {
        public Nullable<int> ID_MATERIA { get; set; }
        public string MATERIA_DESCRIPCION { get; set; }
        public Nullable<int> ID_NATURALEZA { get; set; }
        public string NATURALEZA_DESCRIPCION { get; set; }
        public Nullable<int> ID_TIPO_PROCESO { get; set; }
        public string TIPO_PROCESO_DESCRIPCION { get; set; }
        public string correlativo { get; set; }
        public Nullable<int> ID_TIPO_INSTANCIA { get; set; }
        public string NOMBRE_TIPO_INSTANCIA { get; set; }
        public int id_proceso_instancia { get; set; }
        public string nombre_instancia { get; set; }
        public string numero_instancia { get; set; }
        public Nullable<System.DateTime> FECHA_INICIO_INSTANCIA { get; set; }
        public Nullable<System.DateTime> FECHA_FINAL_INSTANCIA { get; set; }
        public int id_plazo { get; set; }
        public string nombre_plazo { get; set; }
        public Nullable<int> id_abogado { get; set; }
        public string NOMBRE_APELLIDO { get; set; }
        public Nullable<System.DateTime> FECHA_INICIO_PLAZO { get; set; }
        public Nullable<System.DateTime> FECHA_FINAL_PLAZO { get; set; }
        public string estado { get; set; }
        public string anotacion { get; set; }
        public Nullable<decimal> dias_plazo { get; set; }
        public Nullable<int> DIFERENCIA { get; set; }
        public Nullable<decimal> diferencia_dias { get; set; }
        public string COLOR_ALERTA { get; set; }
    }
}
