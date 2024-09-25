using A2.Models;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;
using System.Text;

namespace A2.Helper
{
    public class CalendarOutputFormatter : TextOutputFormatter
    {
        public CalendarOutputFormatter()
        {
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/calendar"));
            SupportedEncodings.Add(Encoding.UTF8);
        }

        public override Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            Event eventcal = (Event)context.Object;
            StringBuilder builder = new StringBuilder();
            builder.AppendLine("BEGIN:VCALENDAR");
            builder.AppendLine("VERSION:2.0");
            builder.AppendLine("PRODID:vbha650");
            builder.AppendLine("BEGIN:VEVENT");

            builder.Append("UID:").AppendLine(eventcal.Id.ToString());
            string time = DateTime.UtcNow.ToString("yyyyMMdd'T'HHmmss'Z'");
            builder.Append("DTSTAMP:").AppendLine(time);
            builder.Append("DTSTART:").AppendLine(eventcal.Start);
            builder.Append("DTEND:").AppendLine(eventcal.End);
            builder.Append("SUMMARY:").AppendLine(eventcal.Summary);
            builder.Append("DESCRIPTION:").AppendLine(eventcal.Description);
            builder.Append("LOCATION:").AppendLine(eventcal.Location);

            builder.AppendLine("END:VEVENT");
            builder.AppendLine("END:VCALENDAR");

            string outString = builder.ToString();
            byte[] outBytes = selectedEncoding.GetBytes(outString);
            var response = context.HttpContext.Response.Body;
            return response.WriteAsync(outBytes, 0, outBytes.Length);
        }
    }
}
