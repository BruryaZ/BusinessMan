using Amazon.Runtime;
using Amazon;
using Amazon.S3;
using BusinessMan.API;
using BusinessMan.Core;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using BusinessMan.Data;
using BusinessMan.Data.Repositories;
using BusinessMan.Service;
using BusinessMan.Service.OperationsOnFiles;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using BusinessMan.Core.BasicModels;

var builder = WebApplication.CreateBuilder(args);

// הזרקת קובץ הנתונים 
//builder.Services.AddDbContext<DataContext>(); 
builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// הוספת קובץ appsettings.Development.json
builder.Configuration
    .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true);

// Add services to the container.
// הוראה להתעלם מהפניייה מעגלית

// הוספת קובץ appsettings.Development.json

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// הזרקת תלויות
builder.Services.AddScoped<ReadFileContent>();
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRepository<User>, UserRepository>();
builder.Services.AddScoped<IRepository<Email>, Repository<Email>>();
builder.Services.AddScoped<IRepository<Invoice>, Repository<Invoice>>();
builder.Services.AddScoped<IRepository<JournalEntry>, Repository<JournalEntry>>();
builder.Services.AddScoped<IRepository<Business>, Repository<Business>>();
builder.Services.AddScoped<IRepository<BusinessReportDto>, Repository<BusinessReportDto>>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IService<Business>, BusinessService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IBusinessReportService, BusinessReportService>();
builder.Services.AddScoped<IRepository<FileDto>, Repository<FileDto>>();
builder.Services.AddScoped<IFileService, FileUploadService>();
builder.Services.AddScoped<ReadFileContent>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT Configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Fix for CS8604: Ensure the configuration value is not null before using it.
    var jwtKey = builder.Configuration["JWT:Key"];
    if (string.IsNullOrEmpty(jwtKey))
    {
        throw new InvalidOperationException("JWT:Key is not configured in the application settings.");
    }

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

        NameClaimType = "user_id",
        RoleClaimType = "role"
    };

    // מאפשר קריאת טוקן מתוך עוגייה
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Cookies["jwt"];
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

// תמיכה ב swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });

    // דרישת האבטחה לכל הבקשות
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


// AWS הוספת שירותי 
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var credentials = new BasicAWSCredentials(
        configuration["AWS:AccessKey"],
        configuration["AWS:SecretKey"]
    );
    var clientConfig = new AmazonS3Config
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(configuration["AWS:Region"])
    };
    return new AmazonS3Client(credentials, clientConfig);
});

// שירותי CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
         "https://businessman-fuov.onrender.com",
         "http://localhost:5173", 
         "http://localhost:4200")
       .AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAutoMapper(typeof(MappingProfile));

// הוספת הזרקת תלויות ל-HttpContext
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// הוספת-CORS
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

// My middlwares:
app.UseUserContext();

app.MapControllers();

app.Run();