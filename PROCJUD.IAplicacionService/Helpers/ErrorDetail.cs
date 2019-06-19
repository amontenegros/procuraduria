using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.IAplicacionService.Helpers
{
    [DataContract]
    [Serializable]
    public class ErrorDetail
    {
        [DataMember]
        public Dictionary<string, string> errors { get; set; }

        [DataMember]
        public string internalMessage { get; set; }

        [DataMember]
        public int statusCode { get; set; }

        [DataMember]
        public string message { get; set; }

       
        public ErrorDetail(int statusCode, string message, string internalMessage = null, Dictionary<string, string> errors = null)
        {
            this.message = message;
            this.internalMessage = internalMessage;
            this.errors = errors;
            this.statusCode = statusCode;
        }
    }
}
