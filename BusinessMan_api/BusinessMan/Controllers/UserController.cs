using AutoMapper;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Extentions;
using BusinessMan.Core.Models;
using BusinessMan.Core.Services;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BusinessMan.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IService<User> _allUsers;
        private readonly IMapper _mapper;
        public UserController(IService<User> Users, IMapper mapper)
        {
            _allUsers = Users;
            _mapper = mapper;
        }

        // GET: api/<UserController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAsync()
        {
            var users = await _allUsers.GetListAsync();
            var UsersDTO = _mapper.Map<IEnumerable<UserDto>>(users); // מיפוי ל-DTO

            return Ok(UsersDTO); // החזר את ה-DTOs
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetAsync(int id)
        {
            var user = await _allUsers.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(_mapper.Map<UserDto>(user)); // החזר את ה-DTO
        }

        // POST api/<UserController>
        [HttpPost]
        public async Task<ActionResult<UserDto>> PostAsync([FromBody] UserPostModel value)
        {
            try
            {
                User userToAdd = _mapper.Map<User>(value);
                var createdUser = await _allUsers.AddAsync(userToAdd);
                return Ok(_mapper.Map<UserDto>(createdUser)); // מחזירה את המשתמש שנוסף
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message); // מחזירה 404 במקרה של מייל לא קיים
            }
            catch (Exceptions ex)
            {
                return Conflict(ex.Message); // מחזירה 409 במקרה של קונפליקט
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // מחזירה 500 במקרה של שגיאה כללית
            }
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> PutAsync(int id, [FromBody] User value)
        {
            var updatedUser = await _allUsers.UpdateAsync(id, value);
            if (updatedUser == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<UserDto>(updatedUser)); // החזר את ה-DTO
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var user = await _allUsers.GetByIdAsync(id);
            if (User is null)
            {
                return NotFound();
            }

            await _allUsers.DeleteAsync(user);
            return NoContent();
        }
    }
}