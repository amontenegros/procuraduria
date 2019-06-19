using PROCJUD.IAplicacionService.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.AplicacionService.Base
{
    public class BaseService
    {
        protected void Abort(int statusCode, string msg, Dictionary<string, string> errors = null, Exception ex = null)
        {
            String inner = null;
            if (ex != null)
            {
                inner = ex.Message + " - " + ex.Source;
                if (ex.InnerException != null)
                    inner += " - " + ex.InnerException + " - " + ex.InnerException.Source;
            }

            throw new FaultException<ErrorDetail>(new ErrorDetail(statusCode, msg, inner, errors));
        }
    }
}
