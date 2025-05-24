using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;

namespace BusinessMan.Service
{
    public interface IInvoiceService
    {
        Task<IEnumerable<Invoice>> GetListAsync();
        Task<Invoice?> GetByIdAsync(int id);
        Task<Invoice> AddAsync(Invoice item);
        Task<Invoice?> UpdateAsync(int id, Invoice item);
        Task DeleteAsync(Invoice item);
        Task<IEnumerable<InvoiceDto>> GetMyFiles(int userId);
    }
}