using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASP_NET_Karttapaikat.Models
{
    public class OmaModel
    {
        public List<PaikanTyyppi> PaikanTyyppi { get; set; }
        public List<Siirtymistapa> Siirtymistapa { get; set; }
        public List<Kiertue> Kiertue { get; set; }
    }
}