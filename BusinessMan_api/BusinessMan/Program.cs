using BusinessMan.Core;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using BusinessMan.Data;
using BusinessMan.Data.Repositories;
using BusinessMan.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// ����� ������ �������� ������
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// ����� ������
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRepository<User>, UserRepository>();
builder.Services.AddScoped<IRepository<Example>, Repository<Example>>();
builder.Services.AddScoped<IRepository<Email>, Repository<Email>>();
builder.Services.AddScoped<IRepository<Invoice>, Repository<Invoice>>();
builder.Services.AddScoped<IRepository<Business>, Repository<Business>>();
builder.Services.AddScoped<IService<Example>, ExampleService>();
builder.Services.AddScoped<IService<Invoice>, InvoiceService>();
builder.Services.AddScoped<IService<Business>, BusinessService>();
builder.Services.AddScoped<IService<User>, UserService>();
builder.Services.AddScoped<IRepository<FileDto>, Repository<FileDto>>();
builder.Services.AddScoped<IService<FileDto>, FileUploadService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// ����� ���� ������� 
builder.Services.AddDbContext<DataContext>();

//// JWT Configuration
//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,
//        ValidIssuer = builder.Configuration["JWT:Issuer"],
//        ValidAudience = builder.Configuration["JWT:Audience"],
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
//    };
//});

// ����� � swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    //options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    //{
    //    Scheme = "Bearer",
    //    BearerFormat = "JWT",
    //    In = ParameterLocation.Header,
    //    Name = "Authorization",
    //    Description = "Bearer Authentication with JWT Token",
    //    Type = SecuritySchemeType.Http
    //});
    //options.AddSecurityRequirement(new OpenApiSecurityRequirement
    //{
    //    {
    //        new OpenApiSecurityScheme
    //        {
    //            Reference = new OpenApiReference
    //            {
    //                Id = "Bearer",
    //                Type = ReferenceType.SecurityScheme
    //            }
    //        },
    //        new List<string>()
    //    }
    //});
});

// ������ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

// �����-CORS
app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//app.UseAuthorization();

app.MapControllers();

app.Run();
