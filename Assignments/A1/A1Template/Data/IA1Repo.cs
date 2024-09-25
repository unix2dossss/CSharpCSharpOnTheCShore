using A1.Models;
using Microsoft.AspNetCore.SignalR;

namespace A1.Data
{
    public interface IA1Repo
    {
        //Endpoint 1
        String GetApiVersion();
        // Endpoint 3
        IEnumerable<Sign> GetAllSigns();
        // Endpoint 4
        IEnumerable<Sign> GetSignsByDescription(string keyword);
        // Endpoint 6
        Comment GetComment(int id);
        // Endpoint 7
        Comment WriteComment(Comment comment);
        // Endpoint 8
        IEnumerable<Comment> Comments(int? no_of_comments);
    }
}
