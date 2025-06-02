using BusinessMan.Core.BasicModels;
using BusinessMan.Core.DTO_s;

namespace BusinessMan.Core.Services
{
    public interface IInvoiceService
    {
        Task<IEnumerable<Invoice>> GetListAsync();
        Task<Invoice?> GetByIdAsync(int id);
        Task<Invoice> AddAsync(Invoice item);
        Task<Invoice?> UpdateAsync(int id, Invoice item);
        Task DeleteAsync(Invoice item);
        Task<IEnumerable<InvoiceDto>> GetMyFiles(int userId);
        Task<MonthlyReportDto> GetMonthlyReportAsync(int businessId, int year, int month);
    }
}