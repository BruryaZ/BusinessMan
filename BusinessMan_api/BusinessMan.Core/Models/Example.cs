using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class Example
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("num")]
        public int Num { get; set; }
    }
}
