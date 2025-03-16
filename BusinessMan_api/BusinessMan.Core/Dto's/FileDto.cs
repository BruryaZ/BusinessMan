using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class FileDto
    {
        public int Id { get; set; } // מזהה הקובץ
        public string FileName { get; set; } // שם הקובץ
        public string FilePath { get; set; } // נתיב הקובץ במערכת
        public long Size { get; set; } // גודל הקובץ בבתים
        public DateTime UploadDate { get; set; } // תאריך העלאת הקובץ
    }
}
