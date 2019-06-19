using PROCJUD.Entidades.helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Entidades
{
    public partial class PROCESO
    {

        public ValidationErrors ValidateNew(List<RZ_procuraduria> personas, DAT_PROCESO_INSTANCIA proceso_instancia, DAT_PROCESO_PLAZO proceso_plazo)
        {
            var validation = new ValidationErrors();

            if (materia == null || materia == 0)
                validation.AddError("materia", "Naturaleza debe contener un valor");

            if (id_naturaleza == null || id_naturaleza == 0)
                validation.AddError("id_naturaleza", "Materia debe contener un valor");

            if (id_tipo_proceso == null || id_tipo_proceso == 0)
                validation.AddError("id_tipo_proceso", "Condición procesal del estado debe contener un valor");

            if (!personas.Any())
                validation.AddError("personas", "Debe haber al menos una persona ingresada");

            if (ID_ABOGADO == null || ID_ABOGADO == 0)
                validation.AddError("id_abogado", "Seleccione abogado");

            if (proceso_instancia.id_tipo_instancia == 0)
                validation.AddError("_instancia_id_tipo_instancia", "Seleccione la instancia");

            if (String.IsNullOrEmpty(proceso_instancia.nombre_instancia))
                validation.AddError("_instancia_nombre_instancia", "Ingrese el nombre de la instancia");

            if (String.IsNullOrEmpty(proceso_instancia.numero_instancia))
                validation.AddError("_instancia_numero_instancia", "Ingrese el número de la instancia");

            if (proceso_plazo.id_plazo == 0)
                validation.AddError("_instancia_id_plazo", "Seleccione el plazo");

            if (proceso_plazo.fecha_inicio == null)
                validation.AddError("_instancia_fecha_notificacion", "Ingrese la fecha de notificación");

            return validation;
        }

    }
}
