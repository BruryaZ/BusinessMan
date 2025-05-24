using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.DTO_s
{
    public class BusinessReportDto
    {
        public string BusinessName { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetProfit => TotalIncome - TotalExpenses;
        public decimal CashFlow { get; set; }
        public int InvoiceCount { get; set; }
        public decimal TotalDebit { get; set; }
        public decimal TotalCredit { get; set; }
        public DateTime ReportDate { get; set; } = DateTime.UtcNow;
    }
}
