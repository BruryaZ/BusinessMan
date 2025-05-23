﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class Invoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; } // מזהה ייחודי
        public decimal AmountDebit { get; set; } // סכום חובה
        public decimal AmountCredit { get; set; } // סכום זכות
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow; // תאריך החשבונית
        public int Status { get; set; } // סטטוס החשבונית
        public string Notes { get; set; } // הערות
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // תאריך יצירה
        public string CreatedBy { get; set; } // נוצר על ידי
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // תאריך עדכון
        public string UpdatedBy { get; set; } // עודכן על ידי
        public string InvoicePath { get; set; }

        // אובייקטים לקשרים בין הטבלאות
        public int? UserId { get; set; } = null;// מזהה המשתמש (קשר לטבלת Users)
        public int? BusinessId { get; set; } = null; // מזהה ייחודי לעסק
        public Business? Business { get; set; } = null;
        public User? User { get; set; } = null;
        public override string ToString()
        {
            return "Amount debit: " + AmountDebit + " Amount credit: " + AmountCredit + " Invoice date: " + InvoiceDate + " Status: " + Status + " Notes: " + Notes + " Created at: " + CreatedAt + " Created by: " + CreatedBy + " Updated at: " + UpdatedAt + " Updated by: " + UpdatedBy;
        }
    }
}