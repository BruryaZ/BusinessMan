using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.BasicModels
{
    public class JournalEntry
    {
        public int Id { get; set; }              // מזהה ייחודי לרישום היומן (Entry)
        public DateTime EntryDate { get; set; }  // תאריך ביצוע הרישום
        public string Description { get; set; }  // תיאור הרישום או הסבר על העסקה
        public decimal Debit { get; set; }       // סכום חיוב (Debit) - הכנסה או הוצאה שתשפיע על חשבון החובה
        public decimal Credit { get; set; }      // סכום זיכוי (Credit) - הכנסה או הוצאה שתשפיע על חשבון הזכות
        public string DebitAccount { get; set; } // שם החשבון שמטופל בחיוב (Debit)
        public string CreditAccount { get; set; }// שם החשבון שמטופל בזיכוי (Credit)
        public int InvoiceId { get; set; }       // מזהה חשבונית הקשורה לרישום היומן (אם רלוונטי)
        public int BusinessId { get; set; }      // מזהה העסק שבו התרחש הרישום
    }
}
