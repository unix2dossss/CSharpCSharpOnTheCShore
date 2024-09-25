﻿using System;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using A2.Data;
using A2.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace A2.Handler
{
	public class A2AuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
	{
        private readonly IA2Repo _repository;

        public A2AuthHandler(
            IA2Repo repository,
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            :base(options, logger, encoder,clock)
        {
            _repository = repository;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.ContainsKey("Authorization"))
            {
                Response.Headers.Add("www-authenticate", "Basic");
                return AuthenticateResult.Fail("Authorization header not found.");
            }

            var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
            var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(":");
            var username = credentials[0];
            var password = credentials[1];

            // Check if the credentials are valid
            if (!_repository.ValidLogin(username, password))
            {
                return AuthenticateResult.Fail("Username and password do not match.");
            }

            // Retrieve the organizer from the repository
            Organizer? organizer = _repository.GetOrganizer(username);

            
            if (organizer != null)
            {
                var claims = new[] { new Claim(ClaimTypes.Name, username), new Claim(ClaimTypes.Role, "organizer") };
                ClaimsIdentity identity = new ClaimsIdentity(claims, "Basic");
                ClaimsPrincipal principal = new ClaimsPrincipal(identity);
                AuthenticationTicket ticket = new AuthenticationTicket(principal, Scheme.Name);
                return AuthenticateResult.Success(ticket);
            }
            else
            {
                var claims = new[] { new Claim(ClaimTypes.Name, username), new Claim(ClaimTypes.Role, "normalUser") };
                ClaimsIdentity identity = new ClaimsIdentity(claims, "Basic");
                ClaimsPrincipal principal = new ClaimsPrincipal(identity);
                AuthenticationTicket ticket = new AuthenticationTicket(principal, Scheme.Name);
                return AuthenticateResult.Success(ticket);
            }
        }





    }
}


