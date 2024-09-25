using System;
using A2.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace A2.Data
{
	public class A2Repo : IA2Repo
	{
        private readonly A2DbContext _dbContext;

		public A2Repo(A2DbContext db)
		{
			_dbContext = db;

        }

        public User Register(User user)
		{
            EntityEntry<User> u = _dbContext.Users.Add(user);
            User ru = u.Entity;
            _dbContext.SaveChanges();
            return ru;
        }

        public User? GetUser(string username)
        {
            User? user = _dbContext.Users.FirstOrDefault(u => u.UserName == username);
            return user;
        }

        public bool ValidLogin(string username, string password)
        {
            User? u = _dbContext.Users.FirstOrDefault(u => u.UserName == username && u.Password == password);
            Organizer? o = _dbContext.Organizers.FirstOrDefault(o => o.Name == username && o.Password == password);

            if (u == null && o == null)
                return false;
            else
                return true;
        }

        public Organizer? GetOrganizer(string username)
        {
            Organizer? o = _dbContext.Organizers.FirstOrDefault(o => o.Name == username);
            return o;
        }

        public Sign? PurchaseSign(string id)
        {
            Sign? s = _dbContext.Signs.FirstOrDefault(s => s.Id == id);
            return s;
        }

        public Event AddEvent(Event e)
        {
            EntityEntry<Event> event1 = _dbContext.Events.Add(e);
            Event addedEvent = event1.Entity;
            _dbContext.SaveChanges();
            return addedEvent;
        }

        public int EventCount()
        {
            int totalEvents = _dbContext.Events.Count();
            return totalEvents;
        }

        public Event? GetEvent(int id)
        {
            Event? e = _dbContext.Events.FirstOrDefault(e => e.Id == id);
            return e;
        }

    }
}

