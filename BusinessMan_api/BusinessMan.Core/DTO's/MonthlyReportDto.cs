using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.DTO_s
{
    public class MonthlyReportDto
    {
        public decimal CurrentMonthIncome { get; set; }
        public decimal PreviousMonthIncome { get; set; }
        public decimal IncomeChangePercent { get; set; }

        public decimal CurrentMonthExpenses { get; set; }
        public decimal PreviousMonthExpenses { get; set; }
        public decimal ExpensesChangePercent { get; set; }

        public decimal CurrentMonthNetProfit { get; set; }
        public decimal PreviousMonthNetProfit { get; set; }
        public decimal NetProfitChangePercent { get; set; }
    }
}