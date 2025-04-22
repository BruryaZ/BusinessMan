using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
<<<<<<< HEAD
=======
using System.ComponentModel.DataAnnotations.Schema;
>>>>>>> recover-commit


namespace BusinessMan.Core.DTO_s
{
    public class FileDto
    {
<<<<<<< HEAD
        public int id { get; set; } // מזהה הקובץ
        //public IFormFile FileContent { get; set; } // הוספתי כדי שיעבוד בסווגר
=======
        public int Id { get; set; } // מזהה הקובץ
        [NotMapped]
        public IFormFile FileContent { get; set; } // הוספתי כדי שיעבוד בסווגר
>>>>>>> recover-commit
        public string FileName { get; set; } // שם הקובץ
        public string FilePath { get; set; } // נתיב הקובץ במערכת
        public long Size { get; set; } // גודל הקובץ בבתים
        public DateTime UploadDate { get; set; } // תאריך העלאת הקובץ
        public Stream FileStream { get; set; } // זרם הקובץ
    }
}
