using DireccionTransitoDataAPI.Configuration;
using DireccionTransitoDataAPI.Interfaces;
using PnP.Core.Auth.Services.Builder.Configuration;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using DireccionTransitoDataAPI.Services;

var builder = WebApplication.CreateBuilder(args);

var configBuilder = new ConfigurationBuilder()

    .SetBasePath(Directory.GetCurrentDirectory())

    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)

    .AddEnvironmentVariables()

    .Build();

builder.WebHost.UseConfiguration(configBuilder);

#region Servicios

#region Scope

builder.Services.AddScoped<IAuthenticationManager, AuthenticationManager>();

builder.Services.AddScoped<IDataService, DataService>();

builder.Services.AddScoped<IDataInicialService, DataInicialService>();

builder.Services.AddScoped<IMySQL, MySQL>();

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

#region PnP

builder.Services.AddPnPCore(options =>
{

    options.PnPContext.GraphFirst = true;

    options.HttpRequests.UserAgent = "ISV|Contoso|ProductX";

    //options.Sites.Add("SiteToWorkWith", new PnPCoreSiteOptions
    //{

    //    SiteUrl = "https://direcciontransito.sharepoint.com/sites/TransitoTome"

    //});

});

builder.Services.AddPnPCoreAuthentication(options =>
{

    // Defino el usuario.
    PnPCoreAuthenticationUsernamePasswordOptions Usuario = new PnPCoreAuthenticationUsernamePasswordOptions
    {

        Username = "Lucas_Salazar@DireccionTransito.onmicrosoft.com",

        Password = "Dragonazul020201@"

    };

    // Y las credenciales generales.
    PnPCoreAuthenticationCredentialConfigurationOptions Credenciales = new PnPCoreAuthenticationCredentialConfigurationOptions
    {

        ClientId = "88f9cd19-20ad-4ab4-b8d7-67ae8d78850e",

        UsernamePassword = Usuario

    };

    options.Credentials.Configurations.Add("usernamepassword", Credenciales);

});

#endregion

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

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