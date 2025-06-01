using AutoMapper;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BusinessMan.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : Controller
    {
        private readonly IService<Business> _allBusinesses;
        private readonly IMapper _mapper;
        private readonly IRepositoryManager _repositoryManager;

        public BusinessController(IService<Business> businesses, IMapper mapper, IRepositoryManager repositoryManager)
        {
            _allBusinesses = businesses;
            _mapper = mapper;
            _repositoryManager = repositoryManager;
        }

        // GET: api/<BusinessController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusinessDto>>> GetAsync()
        {
            var businesses = await _allBusinesses.GetListAsync();
            var businessesDTO = _mapper.Map<IEnumerable<BusinessDto>>(businesses);

            foreach (var business in businessesDTO)
            {
                business.UsersCount = business.UsersCount > 0 ? business.UsersCount : 1; 
            }

            return Ok(businessesDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BusinessDto>> GetAsync(int id)
        {
            var business = await _repositoryManager.GetBusinessWithUsersAsync(id);
            if (business == null)
                return NotFound();

            var businessDto = _mapper.Map<BusinessDto>(business);
            businessDto.UsersCount = business.Users?.Count ?? 0;

            return Ok(businessDto);
        }


        // GET api/<BusinessController>/5
        [HttpGet("all-details{id}")]
        public async Task<ActionResult<Business>> GetAllDetailsAsync(int id)
        {
            var business = await _allBusinesses.GetByIdAsync(id);
            if (business == null)
                return NotFound();
            return Ok(business);
        }

        // POST api/<BusinessController>
        [HttpPost]
        public async Task<ActionResult<BusinessDto>> PostAsync([FromBody] BusinessPostModel value)
        {
            var business = _mapper.Map<Business>(value);
            var createdBusiness = await _allBusinesses.AddAsync(business);
            return Ok(_mapper.Map<BusinessDto>(createdBusiness));
        }

        // PUT api/<BusinessController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<BusinessDto>> PutAsync(int id, [FromBody] Business value)
        {
            var updatedBusiness = await _allBusinesses.UpdateAsync(id, value);
            if (updatedBusiness == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<BusinessDto>(updatedBusiness));
        }

        // DELETE api/<BusinessController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var business = await _allBusinesses.GetByIdAsync(id);
            if (business is null)
            {
                return NotFound();
            }
            await _allBusinesses.DeleteAsync(business);
            return NoContent();
        }
    }
}