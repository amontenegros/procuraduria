using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Entidades.helpers
{
    public class ValidationErrors
    {
        public Dictionary<string, string> errors { get; set; }

        public ValidationErrors()
        {
            this.errors = new Dictionary<string, string>();
        }

        public void AddError(string name, string message)
        {
            this.errors.Add(name, message);
        }

        public bool IsValid
        {
            get
            {
                return !this.errors.Any();
            }
        }

    }
}
