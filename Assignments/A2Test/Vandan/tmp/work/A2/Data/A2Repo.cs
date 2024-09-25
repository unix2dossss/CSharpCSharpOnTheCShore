using Microsoft.EntityFrameworkCore.ChangeTracking;
using A2.Models;

namespace A2.Data
{
    public class A2Repo : IA2Repo
    {

        private readonly A2DbContext _dbContext;
        public A2Repo(A2DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public User? GetUser(string username)
        {
            User? user = _dbContext.Users.FirstOrDefault<User>(u => u.UserName == username);
            return user;
        }

        public User RegisterUser(User user)
        {
            EntityEntry<User> e = _dbContext.Users.Add(user);
            User u = e.Entity;
            _dbContext.SaveChanges();
            return u;
        }

        public Sign? GetSign(string id)
        {
            Sign? sign = _dbContext.Signs.FirstOrDefault<Sign>(s => s.Id == id);
            return sign;
        }

        public bool ValidLogin(string userName, string password)
        {
            User? u = _dbContext.Users.FirstOrDefault<User>(u => u.UserName == userName && u.Password == password);
            if (u != null)
            {
                return true;
            } else
            {
                return false;
            }
        }

        public bool OrganizerValidLogin(string userName, string password)
        {
            Organizer? o = _dbContext.Organizers.FirstOrDefault<Organizer>(o => o.Name == userName && o.Password == password);
            if (o != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public Organizer? GetOrganizer(string name)
        {
            Organizer? o = _dbContext.Organizers.FirstOrDefault<Organizer>(o => o.Name == name);
            return o;
        }

        public Event AddEvent(Event e)
        {
            EntityEntry<Event> newevent = _dbContext.Events.Add(e);
            Event c = newevent.Entity;
            _dbContext.SaveChanges();
            return c;
        }

        public int GetEventCount()
        {
            IEnumerable<Event> events = _dbContext.Events.ToList();
            return events.Count();
        }

        public Event? GetEventById(int id)
        {
            Event? e = _dbContext.Events.FirstOrDefault<Event>(e => e.Id == id);
            return e;
        }
    }
}