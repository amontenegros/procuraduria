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
    
    public partial class EXCEPCIONXPROCESO
    {
        public int ID { get; set; }
        public int ID_PROCESO { get; set; }
        public int ID_TIPO_EXCEPCION { get; set; }
        public string EXCEPCION { get; set; }
        public System.DateTime AUDITMOD { get; set; }
        public string USUARIO { get; set; }
    }
}
