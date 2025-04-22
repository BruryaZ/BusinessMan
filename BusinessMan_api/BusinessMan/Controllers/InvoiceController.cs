using AutoMapper;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BusinessMan.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : Controller
    {
        private readonly IService<Invoice> _allInvoices;
        private readonly IMapper _mapper;

        public InvoiceController(IService<Invoice> invoices, IMapper mapper )
        {
            _allInvoices = invoices;
            _mapper = mapper;
        }

        // GET: api/<InvoiceController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetAsync()
        {
            var invoices = await _allInvoices.GetListAsync();
            var invoicesDTO = _mapper.Map<IEnumerable<InvoiceDto>>(invoices); // מיפוי ל-DTO

            return Ok(invoicesDTO); // החזר את ה-DTOs
        }

        // GET api/<InvoiceController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDto>> GetAsync(int id)
        {
            var invoice = await _allInvoices.GetByIdAsync(id);
            if (invoice == null)
                return NotFound();

            return Ok(_mapper.Map<InvoiceDto>(invoice)); // החזר את ה-DTO
        }

        // POST api/<InvoiceController>
        [HttpPost]
        public async Task<ActionResult<InvoiceDto>> PostAsync([FromBody] Invoice value)
        {
            var createdInvoice = await _allInvoices.AddAsync(value);
            return Ok(_mapper.Map<InvoiceDto>(createdInvoice)); // החזר את ה-DTO
        }

        // PUT api/<InvoiceController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<InvoiceDto>> PutAsync(int id, [FromBody] Invoice value)
        {
            var updatedInvoice = await _allInvoices.UpdateAsync(id, value);
            if (updatedInvoice == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<InvoiceDto>(updatedInvoice)); // החזר את ה-DTO
        }

        // DELETE api/<InvoiceController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var invoice = await _allInvoices.GetByIdAsync(id);
            if (invoice is null)
            {
                return NotFound();
            }
            await _allInvoices.DeleteAsync(invoice);
            return NoContent();
        }
    }
}
