using BusinessMan.Core.DTO_s;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Services
{
    public interface IBusinessReportService
    {
        Task<BusinessReportDto> GetBusinessReportAsync(int businessId);
    }
}
