using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using PnP.Core.Auth.Services;
using PnP.Core.Auth.Services.Builder.Configuration;
using PnP.Core.Services;
using PnP.Core.Services.Builder.Configuration;

namespace DireccionTransitoDataAPI.Configuration
{
    public class AuthenticationManager : IAuthenticationManager
    {

        private readonly IConfiguration Configuration;

        private readonly IPnPContextFactory PnPContextFactory;

        private readonly IAuthenticationProviderFactory PnpAuthenticationProvider;

        private readonly PnPCoreOptions PnPCoreOptions;


        public AuthenticationManager(IConfiguration config, IPnPContextFactory pnpContextFactory, IOptions<PnPCoreOptions> pnpCoreOptions, IAuthenticationProviderFactory pnpAuthProvider)
        {

            Configuration = config;

            PnPContextFactory = pnpContextFactory;

            PnPCoreOptions = pnpCoreOptions.Value;

            PnpAuthenticationProvider = pnpAuthProvider;

        }

        public async Task<PnPContext> GetContext(Uri siteUrl)
        {

            var user = PnpAuthenticationProvider.Create("usernamepassword");

            return await PnPContextFactory.CreateAsync(siteUrl, user);

        }

    }

}

public interface IAuthenticationManager
{
    Task<PnPContext> GetContext(Uri siteUrl);

}
