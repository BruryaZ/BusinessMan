using BusinessMan.Core.BasicModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class ConfirmInvoiceRequest
    {
        public Invoice Invoice { get; set; }
        public string FileUrl { get; set; }
        public string FileName { get; set; }
        public long FileSize { get; set; }
    }
}
