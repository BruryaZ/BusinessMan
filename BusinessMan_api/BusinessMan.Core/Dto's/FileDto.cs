﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace BusinessMan.Core.DTO_s
{
    public class FileDto
    {
        public int id { get; set; } // מזהה הקובץ
        //public IFormFile FileContent { get; set; } // הוספתי כדי שיעבוד בסווגר
        public string FileName { get; set; } // שם הקובץ
        public string FilePath { get; set; } // נתיב הקובץ במערכת
        public long Size { get; set; } // גודל הקובץ בבתים
        public DateTime UploadDate { get; set; } // תאריך העלאת הקובץ
    }
}
