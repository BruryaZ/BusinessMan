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
        private readonly IUserService _allUsers;
        private readonly IMapper _mapper;
        public UserController(IUserService userService, IMapper mapper)
        {
            _allUsers = userService;
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

        [HttpGet("users-by-business/{id}")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersByBusinessAsync(int id)
        {
            var users = await _allUsers.GetUserInBusiness(id);
            if (users == null)
                return NotFound();
            var usersDto = _mapper.Map<IEnumerable<UserDto>>(users);
            return Ok(usersDto);
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
        public async Task<ActionResult<UserDto>> PutAsync(int id, [FromBody] UserDto value)
        {
            var existingUser = await _allUsers.GetByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // מעדכנים את המופע הקיים עם הערכים החדשים
            _mapper.Map(value, existingUser);

            var updatedUser = await _allUsers.UpdateAsync(id, existingUser);
            return Ok(_mapper.Map<UserDto>(updatedUser));
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