using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class FileUpload
    {
        public string FileName { get; set; } // שם הקובץ
        public byte[] FileContent { get; set; } // תוכן הקובץ
        public long Size { get; set; } // גודל הקובץ
        public string ContentType { get; set; } // סוג התוכן
    }
}
