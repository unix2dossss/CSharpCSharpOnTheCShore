using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using A2.Data;
using A2.Dtos;
using A2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;

namespace A2.Controllers
{
	[Route("webapi")]
	[ApiController]
	public class A2Controller : Controller
	{
        private readonly IA2Repo _repository;
        public A2Controller(IA2Repo a2Repo)
		{
			_repository = a2Repo;

        }

        //Endpoint 1

		[HttpPost("Register")]
        public ActionResult<string> Register(User user)
        {
            
            var u = _repository.GetUser(user.UserName);
            //Check if user already exists
            if (u == null)
            {
                _repository.Register(user);
                return Ok("User successfully registered.");
            }
            return Ok($"UserName {user.UserName} is not available.");

        }


        //Endpoint 2

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("PurchaseSign/{id}")]
        public ActionResult<PurchaseOutput> PurchaseSign(string id)
        {

            Claim? nameClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);

            if (nameClaim == null)
            {
                return Unauthorized();
            }

            string username = nameClaim.Value;

            Sign? s = _repository.PurchaseSign(id);
            if (s == null)
            {
                return BadRequest($"Sign {id} not found");
            }

            PurchaseOutput output = new PurchaseOutput
            {
                UserName = username,
                SignID = s.Id,
            };

            return Ok(output);
        }


        //Endpoint 3

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "OrganizerOnly")]
        [HttpPost("AddEvent")]
        public ActionResult<string> AddEvent(EventInput e)
        {

            Claim? nameClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);

            if (nameClaim == null)
            {
                return Unauthorized();
            }


            // Define the format for "yyyyMMddTHHmmssZ"
            string formatPattern = @"^\d{8}T\d{6}Z$";

            // Check the format of "Start" and "End"
            bool isStartValid = Regex.IsMatch(e.Start, formatPattern);
            bool isEndValid = Regex.IsMatch(e.End, formatPattern);

            // Validate and return appropriate responses
            if (!isStartValid && !isEndValid)
            {
                return BadRequest("The format of Start and End should be yyyyMMddTHHmmssZ.");
            }
            else if (!isStartValid)
            {
                return BadRequest("The format of Start should be yyyyMMddTHHmmssZ.");
            }
            else if (!isEndValid)
            {
                return BadRequest("The format of End should be yyyyMMddTHHmmssZ.");
            }

            // If validation passes, create the eventInput object
            Event eventInput = new Event
            {
                Start = e.Start,
                End = e.End,
                Summary = e.Summary,
                Description = e.Description,
                Location = e.Location
            };

            var addedEvent = _repository.AddEvent(eventInput);
            return Ok("Success");
        }



        //Endpoint 4

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "AuthOnly")]
        [HttpGet("EventCount")]
        public ActionResult<int> EventCount()
        {

            Claim? nameClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);

            if (nameClaim == null)
            {
                return Unauthorized();
            }

            int totalEvents = _repository.EventCount();
            return Ok(totalEvents);
        }



        //Endpoint 5

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "AuthOnly")]
        [HttpGet("Event/{id}")]
        public ActionResult Event(int id)
        {

            Claim? nameClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);

            if (nameClaim == null)
            {
                return Unauthorized();
            }

            Event? e = _repository.GetEvent(id);

            if (e == null)
            {
                return BadRequest($"Event {id} does not exist.");
            }

            Response.Headers.Add("Content-Type", "text/calendar");
            return Ok(e);

        }
    }
}

