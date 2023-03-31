using DireccionTransitoAPI.Services;
using DireccionTransitoUserAPI.Configuration;
using DireccionTransitoUserAPI.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var configBuilder = new ConfigurationBuilder()

    .SetBasePath(Directory.GetCurrentDirectory())

    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)

    .AddEnvironmentVariables()

    .Build();

builder.WebHost.UseConfiguration(configBuilder);

#region Servicios

#region Scope

builder.Services.AddScoped<IMySQL, MySQL>();

builder.Services.AddScoped<IUserService, UserService>();

#endregion

#region JWT

string JWT_Key = builder.Configuration.GetValue<string>("JWT_Secret_Key");

byte[] Key = Encoding.ASCII.GetBytes(JWT_Key);

string Issuer = builder.Configuration.GetValue<string>("JWT_Issuer");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

    .AddJwtBearer(options =>
    {

        options.TokenValidationParameters = new TokenValidationParameters
        {

            ValidateIssuer = false,

            ValidateAudience = false,

            //ValidateLifetime = true,

            ValidateIssuerSigningKey = true,

            //ValidIssuer = Issuer,

            //ValidAudience = Issuer,

            IssuerSigningKey = new SymmetricSecurityKey(Key)

        };

    });

#endregion

#region Cors

builder.Services.AddCors(options =>
{
    options.AddPolicy("PolicyName", builder =>
    {
        builder
          //.AllowAnyOrigin()
          .WithOrigins("https://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();

    });
});

#endregion

#region Swagger

builder.Services.AddSwaggerGen(options =>
{

    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {

        Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",

        In = ParameterLocation.Header,

        Name = "Authorization",

        Type = SecuritySchemeType.ApiKey

    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();

});

#endregion

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddHttpContextAccessor();

#endregion

#region Aplicacion
var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{

app.UseSwagger();

app.UseSwaggerUI();

//}

// Identify the user. The only statement that is not in the order as documented
app.UseAuthentication();

//// Middleware that adds policies
//app.UsePolicyProvider();
//// Protect the folder by policy
//app.UseProtectFolder(new ProtectFolderOptions { Path = "/p", PolicyName = "admin" });
//// URL rewriter for serving tenant specific files
//app.UseTenantStaticFiles();

//// Serve the static files
//app.UseStaticFiles();

app.UseCookiePolicy();

app.UseCors("PolicyName");

app.UseRouting();

app.UseRequestLocalization();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{

    endpoints.MapControllers();

});

app.Run();

#endregion