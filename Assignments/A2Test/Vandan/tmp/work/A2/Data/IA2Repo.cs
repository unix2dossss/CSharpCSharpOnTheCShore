using A2.Models;

namespace A2.Data
{
    public interface IA2Repo
    {
        User RegisterUser(User user);

        User? GetUser(string username);

        Sign? GetSign(string id);

        Event AddEvent(Event e);

        int GetEventCount();

        Organizer? GetOrganizer(string name);

        bool ValidLogin(string userName, string password);

        bool OrganizerValidLogin(string userName, string password);

        Event? GetEventById(int id);

    }
}
