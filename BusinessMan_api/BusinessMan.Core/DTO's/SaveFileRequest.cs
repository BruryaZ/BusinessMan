using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.DTO_s
{
    // DTO עבור שמירת קובץ בלבד
    public class SaveFileRequest
    {
        public string FileUrl { get; set; }
        public string FileName { get; set; }
        public long FileSize { get; set; }
    }
}
