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
    
    public partial class VwDatProcesoInstanciaResponse
    {
        public Nullable<int> id_materia { get; set; }
        public string materia_descripcion { get; set; }
        public Nullable<int> id_naturaleza { get; set; }
        public string naturaleza_descripcion { get; set; }
        public Nullable<int> id_tipo_proceso { get; set; }
        public string tipo_proceso_descripcion { get; set; }
        public Nullable<int> id_proceso { get; set; }
        public string correlativo { get; set; }
        public string nombre_instancia { get; set; }
        public string numero_instancia { get; set; }
        public Nullable<int> id_tipo_instancia { get; set; }
        public string nombre_tipo_instancia { get; set; }
        public int id_proceso_instancia { get; set; }
        public Nullable<System.DateTime> fecha_inicio { get; set; }
        public Nullable<System.DateTime> fecha_finalizacion { get; set; }
        public string estado { get; set; }
        public string estado_descripcion { get; set; }
        public Nullable<decimal> cantidad_inicial { get; set; }
        public Nullable<decimal> cantidad_final { get; set; }
        public Nullable<int> id_monto { get; set; }
        public string unidad_descripcion { get; set; }
        public string tipo_finalizacion { get; set; }
        public string tipo_finalizacion_descripcion { get; set; }
        public string motivo_finalizacion { get; set; }
    }
}
