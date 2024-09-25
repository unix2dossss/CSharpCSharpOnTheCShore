using Microsoft.AspNetCore.Mvc;
using A1.Data;
using A1.Models;
using A1.Dtos;

namespace A1.Controllers
{
    [Route("webapi")]
    [ApiController]
    public class A1Controller : Controller
    {
        private readonly IA1Repo _repository;
        public A1Controller(IA1Repo repository)
        {
            _repository = repository;
        }

        [HttpGet("GetVersion")]
        public ActionResult<String> GetVersion()
        {
            String version = _repository.GetApiVersion();
            return version;
        }

        [HttpGet("Logo")]
        public ActionResult Logo()
        {
            string path = Directory.GetCurrentDirectory();
            string imgDir = Path.Combine(path, "Logos");
            string fileName = Path.Combine(imgDir, "Logo.png");
            string respHeader = "";

            if (System.IO.File.Exists(fileName))
            {
                respHeader = "image/png";
            }
            else
            {
                return NotFound("File not found");
            }
            return PhysicalFile(fileName, respHeader);

        }

        [HttpGet("SignImage/{image_id}")]
        public ActionResult SignImage(string image_id)
        {
            string path = Directory.GetCurrentDirectory();
            string imgDir = Path.Combine(path, "SignsImages");

            string fn1 = Path.Combine(imgDir, image_id + ".png");
            string fn2 = Path.Combine(imgDir, image_id + ".jpg");
            string fn3 = Path.Combine(imgDir, image_id + ".gif");

            string fileName = "";
            string respHeader = "";

            if (System.IO.File.Exists(fn1))
            {
                fileName = fn1;
                respHeader = "image/png";
            }

            else if (System.IO.File.Exists(fn2))
            {
                fileName = fn2;
                respHeader = "image/jpg";
            }
            else if (System.IO.File.Exists(fn3))
            {
                fileName = fn3;
                respHeader = "image/gif";
            }
            else
            {
                fileName = Path.Combine(imgDir, "default.png");
                respHeader = "image/png";

            }
            return PhysicalFile(fileName, respHeader);

        }


        [HttpGet("AllSigns")]
        public ActionResult<IEnumerable<Sign>> AllSigns()
        {
            IEnumerable<Sign> signs = _repository.GetAllSigns();
            return Ok(signs);
        }

        [HttpGet("Signs/{keyword}")]
        public ActionResult<IEnumerable<Sign>> Signs(string keyword)
        {
            IEnumerable<Sign> signs_by_keyword = _repository.GetSignsByDescription(keyword);
            return Ok(signs_by_keyword);
        }

        [HttpGet("GetComment/{id}")]
        public ActionResult<Comment> GetComment(int id)
        {
            Comment comment_by_id = _repository.GetComment(id);
            if (comment_by_id == null)
                return BadRequest($"Comment {id} does not exist.");

            return Ok(comment_by_id);
        }

        [HttpGet("Comments/{no_of_comments}")]
        public ActionResult<IEnumerable<Comment>> Comments(int? no_of_comments)
        {
            IEnumerable<Comment> n_comments = _repository.Comments(no_of_comments);
            return Ok(n_comments);
        }

        [HttpPost("WriteComment")]
        public ActionResult<Comment> WriteComment(CommentInput comment)
        {
            string user_ip = (Request.HttpContext.Connection.RemoteIpAddress).ToString();
            string user_time = DateTime.UtcNow.ToString("yyyyMMdd'T'HHmmss'Z'");
            Comment c = new Comment { UserComment = comment.UserComment, Name = comment.Name, Time = user_time, IP = user_ip };
            Comment addedComment = _repository.WriteComment(c);

            return CreatedAtAction(nameof(GetComment), new { id = addedComment.Id }, c);

        }
    }
}
