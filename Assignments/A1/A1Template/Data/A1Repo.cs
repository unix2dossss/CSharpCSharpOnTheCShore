using A1.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using System.Linq;


namespace A1.Data
{
    public class A1Repo : IA1Repo
    {
        private readonly A1DbContext _dbContext;
        public A1Repo(A1DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Endpoint 1
        public string GetApiVersion()
        {
            String version = "1.0.0 (Ngāruawāhia) by vbha650";
            return version;
        }

        // Endpoint 3
        public IEnumerable<Sign> GetAllSigns()
        {
            IEnumerable<Sign> signs = _dbContext.Signs.ToList<Sign>();
            return signs;
        }

        // Endpoint 4
        public IEnumerable<Sign> GetSignsByDescription(string keyword)
        {
            IEnumerable<Sign> signs = _dbContext.Signs
                                            .AsEnumerable()
                                            .Where(s => s.Description.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                                            .ToList();
            
            if (signs == null || !signs.Any())
            {
                return new List<Sign>();
            }
            return signs;
        }

        // Endpoint 6
        public Comment GetComment(int id)
        {
            Comment? comment = _dbContext.Comments.FirstOrDefault(c => c.Id == id);
            return comment;
        }

        // Endpoint 7
        public Comment WriteComment(Comment comment)
        {
            EntityEntry<Comment> comment_entity = _dbContext.Comments.Add(comment);
            Comment c = comment_entity.Entity;
            _dbContext.SaveChanges();
            return c;
        }

        // Endpoint 8
        public IEnumerable<Comment> Comments(int? no_of_comments = 5)
        {
            IEnumerable<Comment> comments = _dbContext.Comments.ToList<Comment>();

            if (no_of_comments == null)
            {
                no_of_comments = 5;
            }

            if (comments.Count() <= no_of_comments)
            {
                return comments.Reverse();
            } else
            {
                var recentComments = comments.TakeLast((int)no_of_comments).Reverse();

                //foreach (var comment in recentComments)
                //{
                //    Console.WriteLine(comment.Id);
                //}

                return recentComments;
            }
        }

    }
}
