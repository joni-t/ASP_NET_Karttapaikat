//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ASP_NET_Karttapaikat.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Siirtymistapa
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Siirtymistapa()
        {
            this.Kiertue = new HashSet<Kiertue>();
        }
    
        public int tapaId { get; set; }
        public string selite { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Kiertue> Kiertue { get; set; }
    }
}
