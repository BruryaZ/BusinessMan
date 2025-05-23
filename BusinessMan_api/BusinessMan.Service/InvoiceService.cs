﻿using AutoMapper;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using BusinessMan.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Service
{
    // TODO: Implement the UserService class
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
            // עדכון נתוני העסק
            var business = await _repositoryManager.Business.GetByIdAsync(invoice.BusinessId ?? 0);
            if (business != null)
            {
                business.Income += invoice.AmountCredit;
                business.Expenses += invoice.AmountDebit;
                business.CashFlow += invoice.AmountCredit - invoice.AmountDebit;

                business.UpdatedAt = DateTime.UtcNow;
                await _repositoryManager.Business.UpdateAsync(business.Id, business);
            }

            await _repositoryManager.Invoice.AddAsync(invoice);
            await _repositoryManager.SaveAsync();
            return invoice;
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
    }
}
