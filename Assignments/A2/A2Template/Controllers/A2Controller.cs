using A2.Data;
using A2.Models;
using Microsoft.AspNetCore.Mvc;
using A2.Dtos;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Text.RegularExpressions;


[Route("webapi")]
[ApiController]
public class A2Controller : Controller
{
    private readonly IA2Repo _repository;
    public A2Controller(IA2Repo repository)
    {
        _repository = repository;
    }

    [HttpPost("Register")]
    public ActionResult<String> Register(User user)
    {
        if (_repository.GetUser(user.UserName) == null)
        {
            User registered_user = _repository.RegisterUser(user);
            return Ok("User successfully registered.");
        } else
        {
            return Ok($"UserName {user.UserName} is not available.");
        }
    }

    [Authorize(AuthenticationSchemes = "MyAuthentication")]
    [Authorize(Policy = "UserOnly")]
    [HttpGet("PurchaseSign/{id}")]
    public ActionResult<PurchaseOutput> PurchaseSign(string id)
    {

        Claim claim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);


        string uname = claim.Value.ToString();
        // Console.WriteLine(uname);
        Organizer? o = _repository.GetOrganizer(uname);

        if (claim == null)
        {
            return BadRequest();
        } 

        Sign? sign = _repository.GetSign(id);
        if (sign == null)
        {
            return BadRequest($"Sign {id} not found");
        }
        else
        {
            PurchaseOutput purchase = new PurchaseOutput { SignID = id, UserName = uname };
            return Ok(purchase);
        }
    }

    [Authorize(AuthenticationSchemes = "MyAuthentication")]
    [Authorize(Policy = "OrganizerOnly")]
    [HttpPost("AddEvent")]
    public ActionResult<String> AddEvent(EventInput event_in)
    {
        string pattern = @"^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3])[0-5][0-9][0-5][0-9]Z$";
        bool valid_start = Regex.IsMatch(event_in.Start, pattern);
        bool valid_end = Regex.IsMatch(event_in.End, pattern);

        Console.WriteLine(valid_start);
        Console.WriteLine(valid_end);

        if (!valid_start && !valid_end)
        {
            return BadRequest("The format of Start and End should be yyyyMMddTHHmmssZ.");
        }
        else if (!valid_start)
        {
            return BadRequest("The format of Start should be yyyyMMddTHHmmssZ.");
        }
        else if (!valid_end)
        {
            return BadRequest("The format of End should be yyyyMMddTHHmmssZ.");
        } else
        {
            Event ev = new Event { Start = event_in.Start, End = event_in.End, Description = event_in.Description, Location = event_in.Location, Summary = event_in.Summary };
            Event addedEvent = _repository.AddEvent(ev);
            return Ok("Success");
        }
    }

    [Authorize(AuthenticationSchemes = "MyAuthentication")]
    [Authorize(Policy = "UserAndOrganizerOnly")]
    [HttpGet("EventCount")]
    public ActionResult<int> EventCount()
    {
        int event_total = _repository.GetEventCount();
        return Ok(event_total);
    }

    [Authorize(AuthenticationSchemes = "MyAuthentication")]
    [Authorize(Policy = "UserAndOrganizerOnly")]
    [HttpGet("Event/{id}")]
    public ActionResult Event(int id)
    {
        Event? e = _repository.GetEventById(id);
        if (e == null)
        {
            return BadRequest($"Event {id} does not exist.");
        }

        Response.Headers.Add("Content-Type", "text/calendar");
        return Ok(e);
    }
}