using AutoMapper;
using BusinessMan.Core.BasicModels;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using BusinessMan.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InvoiceType = BusinessMan.Core.BasicModels.InvoiceType;

namespace BusinessMan.Service
{
    public class InvoiceService :IInvoiceService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public InvoiceService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Invoice?> GetByIdAsync(int id)
        {
            return await _repositoryManager.Invoice.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Invoice>> GetListAsync()
        {
            return await _repositoryManager.Invoice.GetAllAsync();
        }
        public async Task<Invoice> AddAsync(Invoice invoice)
        {
            var business = await _repositoryManager.Business.GetByIdAsync(invoice.BusinessId ?? 0);
            if (business == null)
                throw new InvalidOperationException("עסק לא קיים");

            string debitAccount = "";
            string creditAccount = "";
            decimal amount = invoice.AmountCredit > 0 ? invoice.AmountCredit : invoice.AmountDebit;

            switch (invoice.Type)
            {
                case InvoiceType.Income:
                    debitAccount = "Cash";
                    creditAccount = "Revenue";
                    business.Income += amount;
                    business.CashFlow += amount;
                    business.TotalAssets += amount;
                    break;

                case InvoiceType.Expense:
                    debitAccount = "Expenses";
                    creditAccount = "Cash";
                    business.Expenses += amount;
                    business.CashFlow -= amount;
                    business.TotalAssets -= amount;
                    break;

                case InvoiceType.AssetIncrease:
                    debitAccount = "Assets";
                    creditAccount = "Cash";
                    business.TotalAssets += amount;
                    business.CashFlow -= amount;
                    break;

                case InvoiceType.AssetDecrease:
                    debitAccount = "Cash";
                    creditAccount = "Assets";
                    business.TotalAssets -= amount;
                    business.CashFlow += amount;
                    break;

                case InvoiceType.LiabilityIncrease:
                    debitAccount = "Cash";
                    creditAccount = "Liabilities";
                    business.TotalLiabilities += amount;
                    business.CashFlow += amount;
                    break;

                case InvoiceType.LiabilityDecrease:
                    debitAccount = "Liabilities";
                    creditAccount = "Cash";
                    business.TotalLiabilities -= amount;
                    business.CashFlow -= amount;
                    break;

                case InvoiceType.EquityIncrease:
                    debitAccount = "Cash";
                    creditAccount = "Equity";
                    business.CashFlow += amount;
                    business.Equity += amount;
                    break;

                case InvoiceType.EquityDecrease:
                    debitAccount = "Equity";
                    creditAccount = "Cash";
                    business.CashFlow -= amount;
                    business.Equity -= amount;
                    break;

                default:
                    throw new ArgumentException("סוג חשבונית לא מוכר");
            }

            // רישום כפול
            var journalEntry = new JournalEntry
            {
                EntryDate = invoice.InvoiceDate,
                Description = invoice.Notes,
                Debit = invoice.AmountDebit,
                Credit = invoice.AmountCredit,
                DebitAccount = debitAccount,
                CreditAccount = creditAccount,
                InvoiceId = invoice.Id,
                BusinessId = invoice.BusinessId ?? 0
            };

            business.UpdatedAt = DateTime.UtcNow;

            await _repositoryManager.Invoice.AddAsync(invoice);
            await _repositoryManager.JournalEntry.AddAsync(journalEntry);
            await _repositoryManager.Business.UpdateAsync(business.Id, business);
            await _repositoryManager.SaveAsync();

            return invoice;
        }

        public async Task<(decimal totalDebit, decimal totalCredit)> GetTotalDebitAndCreditFromJournalAsync(int businessId)
        {
            var allJournalEntries = await _repositoryManager.JournalEntry.GetAllAsync();

            var entriesOfBusiness = allJournalEntries.Where(e => e.BusinessId == businessId);

            decimal totalDebit = entriesOfBusiness.Sum(e => e.Debit);
            decimal totalCredit = entriesOfBusiness.Sum(e => e.Credit);

            return (totalDebit, totalCredit);
        }


        public async Task DeleteAsync(Invoice invoice)
        {
            await _repositoryManager.Invoice.DeleteAsync(invoice);
            await _repositoryManager.SaveAsync();
        }

        public async Task<Invoice?> UpdateAsync(int id, Invoice item)
        {
            item.UpdatedAt = DateTime.UtcNow;
            var updatedInvoice = await _repositoryManager.Invoice.UpdateAsync(id, item);
            await _repositoryManager.SaveAsync();
            return updatedInvoice;
        }

        public async Task<IEnumerable<InvoiceDto>> GetMyFiles(int userId)
        {
            var allInvoices = await _repositoryManager.Invoice.GetAllAsync();
            var myInvoices = allInvoices.Where(i => i.UserId == userId);
            return _mapper.Map<IEnumerable<InvoiceDto>>(myInvoices);
        }
        public async Task<MonthlyReportDto> GetMonthlyReportAsync(int businessId, int year, int month)
        {
            var currentMonthStart = new DateTime(year, month, 1);
            var previousMonthStart = currentMonthStart.AddMonths(-1);
            var currentMonthEnd = currentMonthStart.AddMonths(1);
            var previousMonthEnd = previousMonthStart.AddMonths(1);

            var allInvoices = await _repositoryManager.Invoice.GetAllAsync();

            var currentMonthInvoices = allInvoices
                .Where(i => i.BusinessId == businessId &&
                            i.InvoiceDate >= currentMonthStart &&
                            i.InvoiceDate < currentMonthEnd);

            var previousMonthInvoices = allInvoices
                .Where(i => i.BusinessId == businessId &&
                            i.InvoiceDate >= previousMonthStart &&
                            i.InvoiceDate < previousMonthEnd);

            // חישוב לפי סוג החשבונית בלבד:
            decimal SumIncome(IEnumerable<Invoice> invoices) =>
                invoices.Where(i => i.Type == InvoiceType.Income).Sum(i => i.AmountCredit);

            decimal SumExpenses(IEnumerable<Invoice> invoices) =>
                invoices.Where(i => i.Type == InvoiceType.Expense).Sum(i => i.AmountDebit);

            var currentMonthIncome = SumIncome(currentMonthInvoices);
            var currentMonthExpenses = SumExpenses(currentMonthInvoices);
            var currentNetProfit = currentMonthIncome - currentMonthExpenses;

            var previousMonthIncome = SumIncome(previousMonthInvoices);
            var previousMonthExpenses = SumExpenses(previousMonthInvoices);
            var previousNetProfit = previousMonthIncome - previousMonthExpenses;

            decimal CalcPercentChange(decimal current, decimal previous)
            {
                if (previous == 0) return current == 0 ? 0 : 100;
                return ((current - previous) / previous) * 100;
            }

            return new MonthlyReportDto
            {
                CurrentMonthIncome = currentMonthIncome,
                PreviousMonthIncome = previousMonthIncome,
                IncomeChangePercent = CalcPercentChange(currentMonthIncome, previousMonthIncome),

                CurrentMonthExpenses = currentMonthExpenses,
                PreviousMonthExpenses = previousMonthExpenses,
                ExpensesChangePercent = CalcPercentChange(currentMonthExpenses, previousMonthExpenses),

                CurrentMonthNetProfit = currentNetProfit,
                PreviousMonthNetProfit = previousNetProfit,
                NetProfitChangePercent = CalcPercentChange(currentNetProfit, previousNetProfit)
            };
        }
    }
}