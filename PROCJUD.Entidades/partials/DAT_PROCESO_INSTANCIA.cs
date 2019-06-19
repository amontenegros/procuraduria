using PROCJUD.Entidades.helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Entidades
{
    public partial class DAT_PROCESO_INSTANCIA
    {

        public ValidationErrors ValidateNew(DAT_PROCESO_PLAZO proceso_plazo)
        {
            var validation = new ValidationErrors();
                     

            if (this.id_tipo_instancia == 0)
                validation.AddError("id_tipo_instancia", "Seleccione la instancia");

            if (this.fecha_inicio == null)
                validation.AddError("fecha_inicio", "Seleccione la fecha");

            if (String.IsNullOrEmpty(this.nombre_instancia))
                validation.AddError("nombre_instancia", "Ingrese el nombre de la instancia");

            if (String.IsNullOrEmpty(this.numero_instancia))
                validation.AddError("numero_instancia", "Ingrese el número de la instancia");

            if (proceso_plazo.id_plazo == 0)
                validation.AddError("id_plazo", "Seleccione el plazo");

            if (proceso_plazo.fecha_inicio == null)
                validation.AddError("fecha_notificacion", "Ingrese la fecha de notificación");

            return validation;
        }

        public ValidationErrors ValidateUpdate()
        {
            var validation = new ValidationErrors();
            
            if (this.fecha_inicio == null)
                validation.AddError("fecha_inicio", "Seleccione la fecha");

            if (String.IsNullOrEmpty(this.nombre_instancia))
                validation.AddError("nombre_instancia", "Ingrese el nombre de la instancia");

            if (String.IsNullOrEmpty(this.numero_instancia))
                validation.AddError("numero_instancia", "Ingrese el número de la instancia");           

            return validation;
        }

    }
}
