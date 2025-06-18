export interface MonthlyReportResponse {
    monthlyMetric: number;
    currentMonthIncome: number;
    incomeChangePercent: number;
    currentMonthExpenses: number;
    expensesChangePercent: number;
}