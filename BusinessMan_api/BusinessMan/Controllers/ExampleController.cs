using Microsoft.AspNetCore.Authorization;
using BusinessMan.Core.Models;
using BusinessMan.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BusinessMan.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[AllowAnonymous] // מאפשר גישה ללא הזדהות לכל הפעולות ב-controller
    public class ExampleController : Controller
    {
        private readonly IService<Example> _Example;

        public ExampleController(IService<Example> ex)
        {
            _Example = ex;
        }

        // GET: api/<BusinessController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Example>>> GetAsync()
        {
            var Examplees = await _Example.GetListAsync();
            return Ok(Examplees);
        }

        // GET api/<ExampleController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Example>> GetAsync(int id)
        {
            var Example = await _Example.GetByIdAsync(id);
            if (Example == null)
                return NotFound();
            return Ok(Example);
        }

        // POST api/<ExampleController>
        [HttpPost]
        public async Task<ActionResult<Example>> PostAsync([FromBody] Example value)
        {
            var createdExample = await _Example.AddAsync(value);
            return Ok(createdExample);
        }

        // PUT api/<ExampleController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Example>> PutAsync(int id, [FromBody] Example value)
        {
            var updatedExample = await _Example.UpdateAsync(id, value);
            if (updatedExample == null)
            {
                return NotFound();
            }
            return Ok(updatedExample);
        }

        // DELETE api/<ExampleController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var Example = await _Example.GetByIdAsync(id);
            if (Example is null)
            {
                return NotFound();
            }
            await _Example.DeleteAsync(Example);
            return NoContent();
        }
    }
}