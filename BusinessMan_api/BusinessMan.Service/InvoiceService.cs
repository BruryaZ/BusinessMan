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
    public class InvoiceService : IInvoiceService
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

            // סכום אחיד, חובה וזכות יהיו שווים
            // סכום אחיד, חובה וזכות יהיו שווים
            if (invoice.AmountDebit <= 0 || invoice.AmountCredit <= 0)
                throw new InvalidOperationException("סכום חובה וזכות חייבים להיות חיוביים וגדולים מאפס");

            if (invoice.AmountDebit != invoice.AmountCredit)
                throw new InvalidOperationException("סכום חובה וסכום זכות חייבים להיות שווים");

            invoice.Amount = invoice.AmountDebit; // קביעת הסכום הכללי לפי אחד מהם

            invoice.AmountDebit = invoice.Amount;
            invoice.AmountCredit = invoice.Amount;

            decimal amount = invoice.AmountDebit; // זהה ל- AmountCredit

            string debitAccount = "";
            string creditAccount = "";

            switch (invoice.Type)
            {
                case InvoiceType.Income:
                    debitAccount = "Cash";
                    creditAccount = "Income";
                    business.Income += amount;
                    business.CashFlow += amount;
                    business.TotalAssets += amount;
                    break;

                case InvoiceType.Expense:
                    debitAccount = "Expense";
                    creditAccount = "Cash";
                    business.Expenses += amount;
                    business.CashFlow -= amount;
                    business.TotalAssets -= amount;
                    break;

                case InvoiceType.AssetIncrease:
                    debitAccount = "Asset";
                    creditAccount = "Cash";
                    business.TotalAssets += amount;
                    business.CashFlow -= amount;
                    break;

                case InvoiceType.AssetDecrease:
                    debitAccount = "Cash";
                    creditAccount = "Asset";
                    business.TotalAssets -= amount;
                    business.CashFlow += amount;
                    break;

                case InvoiceType.LiabilityIncrease:
                    debitAccount = "Cash";
                    creditAccount = "Liability";
                    business.TotalLiabilities += amount;
                    business.CashFlow += amount;
                    break;

                case InvoiceType.LiabilityDecrease:
                    debitAccount = "Liability";
                    creditAccount = "Cash";
                    business.TotalLiabilities -= amount;
                    business.CashFlow -= amount;
                    break;

                case InvoiceType.EquityIncrease:
                    debitAccount = "Cash";
                    creditAccount = "Equity";
                    business.Equity += amount;
                    business.CashFlow += amount;
                    break;

                case InvoiceType.EquityDecrease:
                    debitAccount = "Equity";
                    creditAccount = "Cash";
                    business.Equity -= amount;
                    business.CashFlow -= amount;
                    break;

                default:
                    throw new ArgumentException("סוג חשבונית לא מוכר");
            }


            invoice.UpdatedAt = DateTime.UtcNow;

            await _repositoryManager.Invoice.AddAsync(invoice);
            await _repositoryManager.SaveAsync();

            var debitEntry = new JournalEntry
            {
                EntryDate = invoice.InvoiceDate,
                Description = invoice.Notes,
                Debit = amount,
                Credit = 0,
                DebitAccount = debitAccount,
                CreditAccount = null,
                InvoiceId = invoice.Id,
                BusinessId = invoice.BusinessId ?? 0
            };

            var creditEntry = new JournalEntry
            {
                EntryDate = invoice.InvoiceDate,
                Description = invoice.Notes,
                Debit = 0,
                Credit = amount,
                DebitAccount = null,
                CreditAccount = creditAccount,
                InvoiceId = invoice.Id,
                BusinessId = invoice.BusinessId ?? 0
            };

            await _repositoryManager.JournalEntry.AddAsync(debitEntry);
            await _repositoryManager.JournalEntry.AddAsync(creditEntry);

            business.UpdatedAt = DateTime.UtcNow;
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

            var allEntries = await _repositoryManager.JournalEntry.GetAllAsync();

            var currentMonthEntries = allEntries
                .Where(e => e.BusinessId == businessId &&
                            e.EntryDate >= currentMonthStart &&
                            e.EntryDate < currentMonthEnd);

            var previousMonthEntries = allEntries
                .Where(e => e.BusinessId == businessId &&
                            e.EntryDate >= previousMonthStart &&
                            e.EntryDate < previousMonthEnd);

            // הכנסה = כל סכום שנזקף לזכות חשבון "Income"
            decimal SumIncome(IEnumerable<JournalEntry> entries) =>
                entries.Where(e => e.CreditAccount == "Income").Sum(e => e.Credit);

            // הוצאה = כל סכום שנזקף לחובת חשבון "Expense"
            decimal SumExpenses(IEnumerable<JournalEntry> entries) =>
                entries.Where(e => e.DebitAccount == "Expense").Sum(e => e.Debit);

            var currentMonthIncome = SumIncome(currentMonthEntries);
            var currentMonthExpenses = SumExpenses(currentMonthEntries);
            var currentNetProfit = currentMonthIncome - currentMonthExpenses;

            var previousMonthIncome = SumIncome(previousMonthEntries);
            var previousMonthExpenses = SumExpenses(previousMonthEntries);
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