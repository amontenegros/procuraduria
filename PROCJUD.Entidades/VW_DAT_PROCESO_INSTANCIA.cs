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
    
    public partial class VW_DAT_PROCESO_INSTANCIA
    {
        public Nullable<int> ID_MATERIA { get; set; }
        public string MATERIA_DESCRIPCION { get; set; }
        public Nullable<int> ID_NATURALEZA { get; set; }
        public string NATURALEZA_DESCRIPCION { get; set; }
        public Nullable<int> ID_TIPO_PROCESO { get; set; }
        public string TIPO_PROCESO_DESCRIPCION { get; set; }
        public Nullable<int> ID_PROCESO { get; set; }
        public string correlativo { get; set; }
        public string nombre_instancia { get; set; }
        public string numero_instancia { get; set; }
        public Nullable<int> ID_TIPO_INSTANCIA { get; set; }
        public string NOMBRE_TIPO_INSTANCIA { get; set; }
        public int id_proceso_instancia { get; set; }
        public Nullable<System.DateTime> fecha_inicio { get; set; }
        public Nullable<System.DateTime> fecha_finalizacion { get; set; }
        public string estado { get; set; }
        public string estado_descripcion { get; set; }
        public Nullable<decimal> cantidad_inicial { get; set; }
        public Nullable<decimal> cantidad_final { get; set; }
        public Nullable<int> id_monto { get; set; }
        public string UNIDAD_DESCRIPCION { get; set; }
        public string tipo_finalizacion { get; set; }
        public string TIPO_FINALIZACION_DESCRIPCION { get; set; }
        public string motivo_finalizacion { get; set; }
    }
}
