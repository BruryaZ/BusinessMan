using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Services;
using BusinessMan.Service;
using Microsoft.AspNetCore.Mvc;

namespace BusinessMan.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IBusinessReportService _reportService;
        private readonly IInvoiceService _invoiceService;

        public ReportsController(IBusinessReportService reportService, IInvoiceService invoiceService)
        {
            _reportService = reportService;
            _invoiceService = invoiceService;
        }

        [HttpGet("business-report/{businessId}")]
        public async Task<ActionResult<BusinessReportDto>> GetReport(int businessId)
        {
            try
            {
                var report = await _reportService.GetBusinessReportAsync(businessId);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("monthly")]
        public async Task<ActionResult<MonthlyReportDto>> GetMonthlyReport(int businessId, int year, int month)
        {
            var report = await _invoiceService.GetMonthlyReportAsync(businessId, year, month);
            if (report == null)
                return NotFound();

            return Ok(report);
        }
    }
}
