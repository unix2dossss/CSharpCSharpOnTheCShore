using A1.Data;
using Microsoft.EntityFrameworkCore;

namespace A1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Service Container
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<A1DbContext>(options => options.UseSqlite(builder.Configuration["P1DBConnection"]));
            builder.Services.AddScoped<IA1Repo, A1Repo>();
            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Processing Pipline Init
            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Redirects if the application is under deployement environment
            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
        
    }
}
