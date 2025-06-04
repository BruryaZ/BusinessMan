using AutoMapper;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Service
{
    public class BusinessReportService : IBusinessReportService
    {
        private readonly IRepositoryManager _repository;

        public BusinessReportService(IRepositoryManager repository)
        {
            _repository = repository;
        }

        public async Task<BusinessReportDto> GetBusinessReportAsync(int businessId)
        {
            var business = await _repository.Business.GetByIdAsync(businessId);
            if (business == null)
                throw new Exception("Business not found");

            var entries = await _repository.JournalEntry.GetAllAsync();
            var businessEntries = entries.Where(e => e.BusinessId == businessId).ToList();

            var totalIncome = businessEntries
                .Where(e => e.CreditAccount == "Income")
                .Sum(e => e.Credit);

            var totalExpenses = businessEntries
                .Where(e => e.DebitAccount == "Expense")
                .Sum(e => e.Debit);

            var cashFlow = businessEntries
                .Where(e => e.DebitAccount == "Cash" || e.CreditAccount == "Cash")
                .Sum(e => e.Credit - e.Debit);

            return new BusinessReportDto
            {
                BusinessName = business.Name,
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                CashFlow = cashFlow,
                InvoiceCount = businessEntries
                    .Where(e => e.InvoiceId > 0)
                    .Select(e => e.InvoiceId)
                    .Distinct()
                    .Count(),
                TotalDebit = businessEntries.Sum(e => e.Debit),
                TotalCredit = businessEntries.Sum(e => e.Credit)
            };
        }
    }
}
