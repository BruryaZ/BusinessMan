using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class Business
    {
        public int Id { get; set; } // מזהה ייחודי
        public int BusinessId { get; set; } // מזהה ייחודי לעסק
        public string Name { get; set; } // שם העסק
        public string Address { get; set; } // כתובת העסק
        public string Email { get; set; } // אימייל של העסק
        public string BusinessType { get; set; } // סוג העסק
        public decimal Income { get; set; } // הכנסות העסק
        public decimal Expenses { get; set; } // הוצאות העסק
        public decimal CashFlow { get; set; } // תזרים מזומנים של העסק
        public decimal TotalAssets { get; set; } // סך הנכסים של העסק
        public decimal TotalLiabilities { get; set; } // סך ההתחייבויות של העסק
        public decimal NetWorth => TotalAssets - TotalLiabilities; // שווי נקי
        public decimal RevenueGrowthRate { get; set; } = 0.00m; // שיעור צמיחת ההכנסות
        public decimal ProfitMargin { get; set; } = 0.00m; // שיעור הרווח
        public decimal CurrentRatio { get; set; } = 0.00m; // יחס נוכחי
        public decimal QuickRatio { get; set; } = 0.00m; // יחס מהיר
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // תאריך יצירה
        public string CreatedBy { get; set; } = "";// נוצר על ידי
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // תאריך עדכון
        public string UpdatedBy { get; set; } = ""; // עודכן על ידי

        // אובייקטים לקשרים בין הטבלאות
        public List<User>? Users { get; set; } = new List<User>();
        public List<Invoice>? Invoices { get; set; } = new List<Invoice>();
    }
}