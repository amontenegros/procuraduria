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
    
    public partial class DAT_PROCESO_INSTANCIA
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public DAT_PROCESO_INSTANCIA()
        {
            this.DAT_PROCESO_INSTANCIA_DOCUMENTO = new HashSet<DAT_PROCESO_INSTANCIA_DOCUMENTO>();
            this.DAT_PROCESO_PLAZO = new HashSet<DAT_PROCESO_PLAZO>();
        }
    
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
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DAT_PROCESO_INSTANCIA_DOCUMENTO> DAT_PROCESO_INSTANCIA_DOCUMENTO { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DAT_PROCESO_PLAZO> DAT_PROCESO_PLAZO { get; set; }
        public virtual PROCESO PROCESO { get; set; }
        public virtual TIPO_INSTANCIA TIPO_INSTANCIA { get; set; }
        public virtual TIPO_MONTO TIPO_MONTO { get; set; }
    }
}
