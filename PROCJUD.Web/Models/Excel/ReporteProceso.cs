using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PROCJUD.Web.Models.Excel
{
    public class ReporteProceso
    {
        [Display(Name = "Número")]
        public string numero { get; set; }

        [Display(Name = "NATURALEZA")]
        public string materia { get; set; }

        [Display(Name = "TIPO PROCESO")]
        public string tipo_proceso { get; set; }

        [Display(Name = "MATERIA")]
        public string naturaleza { get; set; }

        [Display(Name = "RAZÓN SOCIAL")]
        public string razon_social { get; set; }

        [Display(Name = "ABOGADO")]
        public string abogado { get; set; }

        [Display(Name = "RESOLUCIÓN")]
        public string resolucion { get; set; }

        [Display(Name = "FECHA")]
        public DateTime? fecha { get; set; }

        [Display(Name = "ESTADO")]
        public string estado { get; set; }
    }
}