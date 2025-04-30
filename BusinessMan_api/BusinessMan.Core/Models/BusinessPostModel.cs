using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class BusinessPostModel
    {
        public int id { get; set; }
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
    }
}
