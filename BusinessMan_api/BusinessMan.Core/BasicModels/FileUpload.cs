using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class FileUpload
    {
        [Key]
        public int Id { get; set; } // מזהה ייחודי
        public IFormFile FileContent { get; set; } // הוספתי כדי שיעבוד בסווגר
        public string FileName { get; set; } // שם הקובץ
        public long Size { get; set; } // גודל הקובץ
        public string ContentType { get; set; } // סוג התוכן
    }
}
