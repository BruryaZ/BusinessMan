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

            var invoices = await _repository.Invoice.GetAllAsync();
            var businessInvoices = invoices.Where(i => i.BusinessId == businessId).ToList();

            return new BusinessReportDto
            {
                BusinessName = business.Name,
                TotalIncome = business.Income,
                TotalExpenses = business.Expenses,
                CashFlow = business.CashFlow,
                InvoiceCount = businessInvoices.Count,
                TotalDebit = businessInvoices.Sum(i => i.AmountDebit),  
                TotalCredit = businessInvoices.Sum(i => i.AmountCredit) 
            };
        }
    }
}
