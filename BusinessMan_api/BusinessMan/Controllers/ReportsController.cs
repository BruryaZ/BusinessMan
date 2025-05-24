using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace BusinessMan.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IBusinessReportService _reportService;

        public ReportsController(IBusinessReportService reportService)
        {
            _reportService = reportService;
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
    }
}
