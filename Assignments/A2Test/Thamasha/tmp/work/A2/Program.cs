
using Microsoft.EntityFrameworkCore;
using A2.Data;
using Microsoft.AspNetCore.Authentication;
using A2.Handler;
using System.Security.Claims;

namespace A2
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //Create the service container
            var builder = WebApplication.CreateBuilder(args);

            // register A2DbContext
            builder.Services.AddDbContext<A2DbContext>(options =>
     options.UseSqlite(builder.Configuration["A2DBConnection"]));

            builder.Services.AddScoped<IA2Repo, A2Repo>();

            //Add services to the container.
            builder.Services.AddControllers();

            builder.Services.AddAuthentication().AddScheme<AuthenticationSchemeOptions, A2AuthHandler>("MyAuthentication", null);
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("UserOnly",
                policy => policy.RequireClaim(ClaimTypes.Role, "normalUser"));

                options.AddPolicy("OrganizerOnly",
                policy => policy.RequireClaim(ClaimTypes.Role, "organizer"));

                options.AddPolicy("AuthOnly",
                policy => { policy.RequireAssertion(context =>
                            context.User.HasClaim(c =>
                            (c.Value == "normalUser" || c.Value == "organizer")));
                });
            });


            builder.Services.AddMvc(options => options.OutputFormatters.Add(new CalendarOutputFormatter()));

            //Configure Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            //Create the pipeline
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
}
