using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using A2.Data;
using A2.Handler;
using System.Security.Claims;
using A2.Helper;

namespace A2;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddDbContext<A2DbContext>(options => options.UseSqlite(builder.Configuration["A2DBConnection"]));
        builder.Services.AddScoped<IA2Repo, A2Repo>();

        builder.Services.AddAuthentication()
                        .AddScheme<AuthenticationSchemeOptions, A2AuthHandler>
                        ("MyAuthentication", null);

        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("UserOnly",
            policy => policy.RequireClaim(ClaimTypes.Role, "user"));
            options.AddPolicy("OrganizerOnly",
            policy => policy.RequireClaim(ClaimTypes.Role, "organizer"));
            options.AddPolicy("UserAndOrganizerOnly", policy => {
                policy.RequireAssertion(context =>
               context.User.HasClaim(c =>
               (c.Value == "user" || c.Value == "organizer")));
            });
        });

        builder.Services.AddMvc(options => options.OutputFormatters.Add(new CalendarOutputFormatter()));

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();


        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
