using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.DTO_s
{
    public class InvoiceDto
    {
        public int Id { get; set; } // מזהה ייחודי
        public string AmountDebit { get; set; } // סכום חובה
        public string AmountCredit { get; set; } // סכום זכות
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow; // תאריך החשבונית
        public int Status { get; set; } // סטטוס החשבונית
        public string Notes { get; set; } // הערות
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // תאריך יצירה
        public string CreatedBy { get; set; } // נוצר על ידי
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // תאריך עדכון
        public string UpdatedBy { get; set; } // עודכן על ידי
        public string InvoicePath { get; set; }

        // אובייקטים לקשרים בין הטבלאות
        public int? UserId { get; set; } // מזהה המשתמש (קשר לטבלת Users)
        public int? BusinessId { get; set; } // מזהה ייחודי לעסק
    }
}
