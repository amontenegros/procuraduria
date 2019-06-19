using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Response
{
    public class PaginationResponse<T> where T : class
    {
        public int page { get; set; }

        public int pageSize { get; set; }

        public int total { get; set; }

        public List<T> items { get; set; }

    }
}
