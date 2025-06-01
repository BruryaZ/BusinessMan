export interface ProdactionReportData {
    businessName: string,
    totalIncome: number,
    totalExpenses: number,
    netProfit: number,
    cashFlow: number,
    invoiceCount: number,
    totalDebit: number,
    totalCredit: number,
    reportDate: string
}

export interface ProdactionReportMonthlyData {
    currentMonthIncome: number,
    previousMonthIncome: number,
    incomeChangePercent: number,
    currentMonthExpenses: number,
    previousMonthExpenses: number,
    expensesChangePercent: number,
    currentMonthNetProfit: number,
    previousMonthNetProfit: number,
    netProfitChangePercent: number
}