using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class Invoice
    {
        public int Id { get; set; } // מזהה ייחודי
        public string AmountDebit { get; set; } // סכום חובה
        public string AmountCredit { get; set; } // סכום זכות
        public DateTime InvoiceDate { get; set; } = DateTime.Now; // תאריך החשבונית
        public int Status { get; set; } // סטטוס החשבונית
        public string Notes { get; set; } // הערות
        public DateTime CreatedAt { get; set; } = DateTime.Now; // תאריך יצירה
        public string CreatedBy { get; set; } // נוצר על ידי
        public DateTime UpdatedAt { get; set; } = DateTime.Now; // תאריך עדכון
        public string UpdatedBy { get; set; } // עודכן על ידי

        // אובייקטים לקשרים בין הטבלאות
        public int? UserId { get; set; } // מזהה המשתמש (קשר לטבלת Users)
        public int? BusinessId { get; set; } // מזהה ייחודי לעסק
        public Business? Business { get; set; }
        public User? User { get; set; }
        public override string ToString()
        {
            return "Amount debit: " + AmountDebit + " Amount credit: " + AmountCredit + " Invoice date: " + InvoiceDate + " Status: " + Status + " Notes: " + Notes + " Created at: " + CreatedAt + " Created by: " + CreatedBy + " Updated at: " + UpdatedAt + " Updated by: " + UpdatedBy;
        }
    }
}